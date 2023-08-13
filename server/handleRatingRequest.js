const express = require('express');
const router = express.Router();
const oracledb = require('oracledb'); 
const config = require('./config');


// handleRatingRequest.js

/* 
The frontend gives options to the user to post/put/get/delete data in the db, 
which will then call the route with the CRUD function associated with the users request. 

Backend function called 'handleRatingRequest' connects to the DB and handles CRUD logic based 
on the 'req.method' it receives from the API route. 

The API route receives a request from the front end, 
uses handleRatingRequest to process the CRUD logic in that request, and issue a response. 

*/

async function handleRatingRequest (req, res) {
    let connection; // DB connection
    
    const {uID, musicID, rating, title, artist} = req.body; // data from post req
    const {userID} = req.params; // params from get request
    const {putUserID, putMusicID, putNewRating} = req.body; // data from put req
    const {delUserID, delMusicID} = req.body // data from del req

    try{ {/* connect to DB */}
            connection = await oracledb.getConnection({
            user: config.user,
            password: config.password,
            connectString: config.connectString
        });
        console.log('Oracle DB connection established successfully.');


        switch (req.method) {
            case 'POST':
            // Check if a rating already exists for the given musicID and userID
            result = await connection.execute(
                `SELECT COUNT(*) FROM RATINGS WHERE MUSICID = :musicID AND USERID = :userID`,
                [musicID, uID]
            );
            if (result.rows[0][0] > 0) {
                // If a rating exists, handle it as a PUT request
                result = await connection.execute(
                    `UPDATE RATINGS SET RATING = :rating WHERE USERID = :u_ID AND MUSICID = :musicID`,
                    [rating, uID, musicID]
                    )
                break;
            } else {
                // If no rating exists, proceed with the regular POST request
                result = await connection.execute(
                    `INSERT INTO RATINGS (MUSICID, RATING, USERID, TITLE, ARTIST) VALUES (:musicID, :rating, :u_ID, :title, :artist)`,
                    [musicID, rating, uID, title, artist]
                );
            }
            break;
     
        case 'GET':
                 const {userID} = req.params; 
                 result = await connection.execute(
                 `SELECT TITLE, ARTIST, RATING, MUSICID FROM RATINGS WHERE USERID = :userID`,
                 [userID]
                 );
                 const ratings = result.rows.map(row => ({
                     title: row[0],
                     artist: row[1],
                     rating: row[2],
                     musicID: row[3]
                 }))
                 return ratings;

            case 'PUT':
                result = await connection.execute(
                `UPDATE RATINGS SET RATING = :putNewRating WHERE USERID = :putUserID AND MUSICID = :putMusicID`,
                [putNewRating, putUserID, putMusicID]
                )
            break;

            case 'DELETE':
                result = await connection.execute(
                `DELETE FROM RATINGS WHERE MUSICID = :delMusicID AND USERID = :delUserID`,
                [delMusicID, delUserID]
                );
            break;

            default:
                 return res.status(400).json({ error: 'Invalid action' });
        }

        // Commit the transaction
        await connection.commit();

    // error handling
    } catch (error) { 
        console.log("Error handling the rating request: ", error);
        if (connection) await connection.rollback(); // rollback the transaction in event of an error
        return res.status(500).json({ error: 'Internal server error'});
        
    } finally {
        // release the connection to oracleDB
        if (connection) await connection.close();
    }

}

module.exports = handleRatingRequest;
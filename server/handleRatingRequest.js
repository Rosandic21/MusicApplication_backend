const express = require('express');
const router = express.Router();
const oracledb = require('oracledb'); // could delete this line 
const config = require('./config');


// handleRatingRequest.js

/* 
We have a backend function called 'handleRatingRequest' which connects to the DB and handles CRUD logic based 
on the 'action' it receives from the API route. 

The API route receives a request from the front end, 
uses handleRatingRequest to process the CRUD logic in that request, and issue a response. 

Finally, the frontend needs to give options to the user to post/put/get/delete data in the db, 
which will then call the route with the CRUD function associated with the users request. 
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

        // ****************************************************************************************************
        // TODO: ********* if post request has matching musicID+userID then issue a PUT request instead ******
        // ****************************************************************************************************

        // ? req.method==='POST' && GETfunction(musicID, userID)-->returns true : {req.method==='PUT'}


        switch (req.method) {
            case 'POST':
              //  const {uID, musicID, rating, title, artist} = req.body; // data for insert req
                result = await connection.execute(
                `INSERT INTO RATINGS (MUSICID, RATING, USERID, TITLE, ARTIST) VALUES (:musicID, :rating, :u_ID, :title, :artist)`,
                [musicID, rating, uID, title, artist]
                );
            break;

     
        case 'GET':
                 const {userID} = req.params; 
                 result = await connection.execute(
                 `SELECT TITLE, ARTIST, RATING, MUSICID FROM RATINGS WHERE USERID = :userID`,
                 [userID]
                 );
                 console.log('\n'+ "result.rows: "+ result.rows+ '\n');
                 const ratings = result.rows.map(row => ({
                     title: row[0],
                     artist: row[1],
                     rating: row[2],
                     musicID: row[3]
                 }))
                 console.log('\n' + "ratings: ", ratings,'\n')
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
        
        
        
        
        
        
        
        
        
      







        // handle each CRUD operation
        // switch (action) {
        //     case 'create': // Insert a new rating into the database
        //         result = await connection.execute(
        //             `INSERT INTO RATINGS (MUSICID, RATING, USERID, TITLE, ARTIST) VALUES (:musicID, :rating, :userID, :title, :artist)`,
        //             [musicID, rating, userID, title, artist]
        //         );
        //         break;
            
        //     case 'update': // Update current rating 
        //         result = await connection.execute(
        //             `UPDATE RATINGS SET RATING = :rating WHERE MUSICID = :musicID AND USERID = :userID`,
        //             [rating, musicID, userID]
        //         );
        //         break;

        //     case 'get': // fetch the existing rating
        //         result = await connection.execute(
        //         //    'SELECT RATING FROM RATINGS WHERE MUSICID = :musicID AND USERID = :userID',
        //         //    [musicID, userID]
        //             `SELECT TITLE, ARTIST, RATING
        //             FROM RATINGS 
        //             WHERE USERID = :userID`,
        //             [userID]
        //         );
        //         //return res.status(200).json({ rating: result.rows[0][0] }); // Send retrieved data back to front end
        //         break;
        //     case 'delete': // delete existing rating
        //         result = await connection.execute(
        //             `DELETE FROM RATINGS WHERE MUSICID = :musicID AND USERID = :userID`,
        //             [musicID, userID]
        //         );
        //         break;
            
        //     default:
        //         return res.status(400).json({ error: 'Invalid action' });
        // }

        // Commit the transaction
        await connection.commit();

        // Send a success response
       // return res.status(200).json({ message: 'Operation successful' });

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
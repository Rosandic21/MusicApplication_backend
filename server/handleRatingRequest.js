const express = require('express');
const router = express.Router();
//const {handleRatingRequest} = require('oracledb');
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
    // extract the CRUD action and associated data from the request body 
    console.log('\n',"************1. debugging in handleRatingRequest.js req.body not recieved yet***************",'\n')

    const {action, userID, musicID, rating, title, artist} = req.body;
    
    let connection; // DB connection
    let result; // result of query to DB
    console.log('\n',"************1. debugging in handleRatingRequest.js req.body has officially been recieved***************",'\n')

    try{ {/* connect to DB */}
            connection = await oracledb.getConnection({
            user: config.user,
            password: config.password,
            connectString: config.connectString
        });
        console.log('Oracle DB connection established successfully.');

        // handle each CRUD operation
        switch (action) {
            case 'create': // Insert a new rating into the database
            console.log('\n',"***********debugging in handleRating.js create case**********",'\n');
                result = await connection.execute(
                    `INSERT INTO RATINGS (MUSICID, RATING, USERID, TITLE, ARTIST) VALUES (:musicID, :rating, :userID, :title, :artist)`,
                    [musicID, rating, userID, title, artist]
                );
                break;
            
            case 'update': // Update current rating 
                result = await connection.execute(
                    'UPDATE RATINGS SET RATING = :rating WHERE MUSICID = :musicID AND USERID = userID',
                    [rating, musicID, userID]
                );
                break;

            case 'get': // fetch the existing rating
                result = await connection.execute(
                    'SELECT RATING FROM RATINGS WHERE MUSICID = :musicID AND USERID = :userID',
                    [musicID, userID]
                );
                return res.status(200).json({ rating: result.rows[0][0] }); // Send retrieved data back to front end

            case 'delete': // delete existing rating
                result = await connection.execute(
                    'DELETE FROM RATINGS WHERE MUSICID = :musicID AND USERID = :userID',
                    [musicID, userID]
                );
                break;
            
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }

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
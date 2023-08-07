const express = require('express');
const app = express();
const cors = require('cors'); // cross origin resource sharing for browser to enable spotify api access
require("dotenv").config(); // read the .env file which stores clientID, clientSecret, port, and redirectURI 
const config = require('./config'); // stores connection details for oracle db
const oracledb = require('oracledb'); // oracle db used for backend functionality

// middleware
app.use(cors()); // enable cross-origin requests to interact with spotify API
app.use(express.json()); // parse incoming json data from POST or PUT requests and make it available in req.body
app.use(express.urlencoded({extended:true})); // parse incoming url-encoded form data, including arrays/nested objects
const AuthRoutes = require("./routes/authRoutes.js"); // file i made for route authorization
app.use("/", AuthRoutes); // any HTTP requests originating from root or subpaths will be passed through AuthRoutes for processing

// if http GET request from "/" is recieved, respond with welcome message.
app.get("/", (req, res) => { res.send("Welcome"); });

// // Mounting the router on /api route
// app.use('/api', router);


// OracleDB connection
async function run() {
    let connection = await oracledb.getConnection({
    user : config.user,
    password : config.password,
    connectString : config.connectString
    });
    let result = await connection.execute( "SELECT 'You are connected to OracleDB' FROM dual");
    //let result = await connection.execute( "SELECT * FROM RATINGS");
    console.log(result.rows[0]);
}  
run();
 


// // Function to insert rating into the database
// async function insertRating() {
//     try {
//       const connection = await oracledb.getConnection({
//         user: config.user,
//         password: config.password,
//         connectString: config.connectString
//       });
  
//       const data = {
//         action: 'create',
//         artist: 'The Weeknd',
//         musicID: 'https://open.spotify.com/track/2HNcNd5RPZ7DSRNbIl6JsP',
//         rating: 3,
//         title: 'The Hills',
//         userID: '12142890603'
//       };
  
//       await connection.execute(
//         `INSERT INTO RATINGS (MUSICID, RATING, USERID, TITLE, ARTIST) VALUES (:musicID, :rating, :userID, :title, :artist)`,
//         [data.musicID, data.rating, data.userID, data.title, data.artist]
//       );
  
//       await connection.commit();
//       await connection.close();
  
//       console.log('Rating inserted successfully');
//     } catch (error) {
//       console.error('Error inserting rating:', error);
//     }
//   }
  
//   // Call the function on server startup
//   insertRating();


// async function insertRating(data) {
//     let connection;
  
//     try {
//       connection = await oracledb.getConnection({
//         user: config.user,
//         password: config.password,
//         connectString: config.connectString
//       });
  
//       const sql = `BEGIN
//                      insert_rating(:p_ARTIST, :p_RATING, :p_USERID, :p_TITLE, :p_MUSICID);
//                    END;`;
  
//       const binds = {
//         p_ARTIST: data.artist,
//         p_RATING: data.rating,
//         p_USERID: data.userID,
//         p_TITLE: data.title,
//         p_MUSICID: data.musicID
//       };
  
//       await connection.execute(sql, binds);
//       console.log('Rating inserted successfully');
//     } catch (error) {
//       console.error('Error inserting rating:', error);
//     } finally {
//       if (connection) {
//         try {
//           await connection.close();
//         } catch (error) {
//           console.error('Error closing connection:', error);
//         }
//       }
//     }
//   }
  
//   // Insert data on mount
//   app.listen(5000, async () => {
//     console.log('Server is running on port 5000');
    
//     const dataToInsert = {
//       userID: '12142890603',
//       musicID: 'https://open.spotify.com/track/2HNcNd5RPZ7DSRNbIl6JsP',
//       rating: 3,
//       title: 'The Hills',
//       artist: 'The Weeknd'
//     };
  
//     await insertRating(dataToInsert);
//   });







// for the function above, we first need to listen on the port for the HTTP get request
const PORT = process.env.PORT || 5000; // look for environment variable (hosts default port) and if not found then assign port 5000
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)); // start the server on the associated port
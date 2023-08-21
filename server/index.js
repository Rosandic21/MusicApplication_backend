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




// initialize and test DB connection
let connection;
    async function connectDB() {
        oracledb.initOracleClient({libDir: 'path_for_wallet_credentials_here'}); // * insert wallet credentials path
        
        try{
                connection = await oracledb.getConnection({
                user: config.user,
                password: config.password,
                connectString: config.connectString
            })
                if(connection){ 
                    console.log('\nconnected to DB');
                    let result = await connection.execute(`SELECT COUNT(*) FROM RATINGS`);
                    console.log('table rows: '+ result.rows);
                }
            } catch(error){
                console.error('Error:', error);
            } finally {
            if (connection) {
              try {
                await connection.close();
                console.log('Connection closed.');
              } catch (error) {
                console.error('Error closing connection:', error);
              }
            }
        }}

        connectDB();





// for the function above, we first need to listen on the port for the HTTP get request
const PORT = process.env.PORT || 5000; // look for environment variable (hosts default port) and if not found then assign port 5000
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)); // start the server on the associated port
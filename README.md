
# Sonic Studios - Music Application

Welcome to SonicStudios, your ultimate music companion! SonicStudios is a web app that connects to the Spotify API to provide you with the latest music releases, insights into your listening habits, and a personalized song rating system. With SonicStudios, you can discover new tracks, reminisce with your favorite artists, and curate your very own music experience.


## Tech

**Client:** React, TailwindCSS

**Server:** Node, Express, Oracle Cloud Database, SQL Developer

**API**: Spotify API 

**Languages**: JavaScript, SQL, HTML, CSS


## Features

1. New Music Releases
Stay up-to-date with the freshest music releases from your favorite artists. SonicStudios fetches the latest tracks and albums using the Spotify API, ensuring you're always in the know about the hottest tunes hitting the scene.

2. Top Tracks and Artists
Ever wondered about your most listened to tracks and artists? SonicStudios compiles your Spotify listening history to give you insights into your music preferences. Discover which songs and artists have been the soundtrack to your life.

3. Song Rating System
Express your love for your favorite tracks by creating and saving song ratings. SonicStudios's backend database lets you rate songs from your Spotify playlists, helping you keep track of the songs that resonate with you the most. Whether it's a 5-star anthem or a personal favorite, your ratings are at your fingertips.

## Getting Started
-- Before starting, set up React and nodeJS with Express environments -- 

1. Clone this repository to your local machine.

2. Sign up for a Spotify Developer account and create an app to obtain API credentials.

3. Configure your API credentials in the app's settings to enable Spotify integration.

4. Set up the backend ATP database using oracle cloud free tier with default configuration settings: https://www.oracle.com/cloud/free/

5. Click on your oracle ATP database > Navigate to "database connection" > Download an instance wallet. Under the wallet download, you should see mTLS connection strings. Copy the connection string ending in "high" and save it in a text file for later. Unzip the wallet. 

6. Download and install Oracle Instant Client: https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html

7. Open Oracle Instant Client and navigate to the folder: "network > "admin". 

8. Locate where you unzipped your wallet and drag all the contents of the wallet over to the "admin" folder in Oracle Instant Client. 

9. Before attempting to connect to the database, perform the following... In the index.js file under the "server" directory, ensure that oracledb is imported using:
    
        const oracledb = require('oracledb');

Ensure that the client is initialized:

    oracledb.initOracleClient({libDir: '/instant_client_location_here'});

Navigate to config.js and and fill the following fields:

    user: "admin"
    password: "my_oracle_account_password"
    connectString: "mTLS connection string from step 5"

10. Download and install SQL developer: https://www.oracle.com/database/sqldeveloper/

11. Open SQL Developer and create a new database connection. Enter a name for your database, enter admin for the username, enter the password used to sign in to your oracle account, enter "Cloud wallet" for the connection type, enter the location for the .zip file of your wallet in the "Configuration file" field, and enter the string ending in "high" for the "service" field. Leave all other fields default. Save and connect to the database. 

12. Create a new table using the following DDL: 

        CREATE TABLE "ADMIN"."RATINGS" 
        ("MUSICID" VARCHAR2(100 BYTE) COLLATE "USING_NLS_COMP" NOT NULL ENABLE, 
	    "RATING" NUMBER(*,0) NOT NULL ENABLE, 
	    "USERID" NUMBER(*,0) NOT NULL ENABLE, 
	    "TITLE" VARCHAR2(100 BYTE) COLLATE "USING_NLS_COMP" NOT NULL ENABLE, 
	    "ARTIST" VARCHAR2(100 BYTE) COLLATE "USING_NLS_COMP" NOT NULL ENABLE, 
	    CONSTRAINT "RATINGS_PK" PRIMARY KEY ("MUSICID", "USERID"))

Now your database should be ready for use. 

13. Obtain your client_id and client_secret in the spotify developer portal when creating your application. Put these in the .env file located in the "server" directory.

14. Add the scripts to the package.json server side code:       

        "scripts":{
        "start": "node index",
        "dev": "nodemon index"},

15. Run npm install in the client and server directories to install the necessary dependencies. Run "npm run dev" to run the server side code. Then run "npm start" to run the client side code.

16. Access the app in your browser through localhost:3000 and start exploring your music journey!

## Demo

#### Login page: 
![](https://github.com/Rosandic21/MusicApplication_backend/blob/master/gifs/login.gif)

#### New music releases: 
![](https://github.com/Rosandic21/MusicApplication_backend/blob/master/gifs/new-releases.gif)

#### Retrieve user's top tracks and artists: 
![](https://github.com/Rosandic21/MusicApplication_backend/blob/master/gifs/top-music.gif)

#### Rate playlist tracks: 
![](https://github.com/Rosandic21/MusicApplication_backend/blob/master/gifs/rate.gif)

#### Update or delete track ratings: 
![](https://github.com/Rosandic21/MusicApplication_backend/blob/master/gifs/update-delete.gif)

#### Contact form:
![](https://github.com/Rosandic21/MusicApplication_backend/blob/master/gifs/contact.gif)


## API Reference

Spotify API:
https://developer.spotify.com/documentation/web-api

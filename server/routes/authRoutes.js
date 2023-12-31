const express = require ("express");
const router = express.Router();
const fetch = require("node-fetch");
const encodeFormData =  require("../helperFunctions/encodeFormData.js");
const querystring = require("querystring");
const handleRatingRequest = require('../handleRatingRequest');
const path = require('path');

// user logs in and Spotify OAutho2 prompt gets displayed
router.get("/login", async (req, res) => {
 let scope = "user-modify-playback-state user-top-read user-read-playback-state user-read-currently-playing user-library-read playlist-read-private playlist-modify-public playlist-modify-private";
 res.redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECTURI}&scope=${scope}&show_dialog=true`);
})

// user accepts/denies spotify oAuth2 prompt
router.get("/logged", async (req,res) =>{
    // body to be URLEncoded
    let body = {
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: process.env.REDIRECTURI,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    }
// fetch for access and refresh token for the user
await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
    },
    body: encodeFormData(body)
})
.then(resp => resp.json())
.then(data => {
   let query = querystring.stringify(data);
   //redirect link after logging in
   res.redirect(`http://localhost:3000/home?${query}`)
});
})

// get user token to make a fetch request to spotify for user data
router.get("/getUser/:token", async(req, res) => {
    await fetch("https://api.spotify.com/v1/me",{
        headers: {
            "Authorization": `Bearer ${req.params.token}`
        }
    })
    .then(response => response.json())
    .then(data=> {
        userID = data.id;
        res.json(data);
    });
}) 

// get playlists from user
router.get("/playlist/:token", async (req,res) => {
    await fetch(`https://api.spofity.com/v1/me/playlists`, {
        headers: {
            "Authorization": `Bearer ${req.params.token}`
        }
    })
    .then(resp => resp.json())
    .then(data => res.json(data));
})


// POST request for user to insert song ratings into DB 
// request is recieved from RatingComponent.js (frontend) and processed in handleRatingRequest.js (backend)
router.post('/ratings', async (req, res) => {
    try {
      const { uID, musicID, rating, title, artist } = req.body;
      await handleRatingRequest(req, res);
      res.status(200).send('Rating submitted');
    } catch (error) {
      console.error('Error submitting rating:', error);
      res.status(500).send('Internal server error');
    }
  });


  // PUT request for user to update songs ratings in DB
  router.put('/putRatings', async (req, res) => {
    try{
        const { putUserID, putMusicID, putNewRating } = req.body;
        await handleRatingRequest(req, res); 
        res.status(200).send('Rating updated');
    } catch (error) {
        console.error('Error updating rating: ', error);
        res.status(500).send('Internal server error');
    }
  });

  // GET request for user to retrieve songs from DB
  // request recieved from ModifyRatings.js (frontend) and process in RatingComponent.js (backend)
  router.get('/getRatings/:userID', async (req, res) => {
    try{
        const {userID}=req.params;
        const result = await handleRatingRequest(req,res); 
        res.status(200).json({result});
    }catch(error){
        console.error('Error getting ratings: ', error);
        res.status(500).send('Internal server error');
    }
  });


   // DELETE request for use to retrieve songs from DB
   router.delete('/delRatings', async (req,res) => {
    try{
        const {delUserID, delMusicID} = req.body;
        await handleRatingRequest(req, res);
        res.status(200).send('Rating deleted');
    }catch(error){
        console.error('Error deleting rating: ', error);
        res.status(500).send('Internal server error');
    }
   });

    
   router.use(express.static('/Users/daniel/Desktop/SpotifyRemixed/server/routes/404')); // serve static files in 404 folder
   // display 404.html when 404 is detected -- IMPORTANT: ALWAYS KEEP THIS AS THE FINAL ROUTE
   router.use((req, res) => {
    const filePath = path.join(__dirname, '404/404.html');
    res.status(404).sendFile(filePath);
});



module.exports = router;
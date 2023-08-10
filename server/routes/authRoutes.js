const express = require ("express");
const router = express.Router();
const fetch = require("node-fetch");
const encodeFormData =  require("../helperFunctions/encodeFormData.js");
const querystring = require("querystring");



//////******DELETE BELOW */
// const cors = require('cors'); 
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
const handleRatingRequest = require('../handleRatingRequest');
/////*****************DELETE ABOVE  */



/*
router.get("/test", async (req,res) => {
    res.send('hello, test was a success');
})
*/

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

/*TODO**************: change res.redirect above ***************************
redirect to new page http://localhost:3000/home (this will make it so user sees new content on page instead of login form)
pass the query as a cookie OR BETTER --> USE CORS!!!
    method to pass as a cookie:
server side: res.cookie('accessToken', 'your_access_token_value', { maxAge: 3600000, httpOnly: true });
client side: npm install js-cookie
import Cookies from 'js-cookie';
const accessToken = Cookies.get('accessToken'); // Now you have the access token without including it in the URL
***************************************************************************
*/
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

// // let user search for songs
// router.post("/search/:token", async (req,res) => {
//     // split body so it can be encoded in the query
//     let unchangedQueryBody = req.body.message.split(" ");
//     let changedQueryBody = unchangedQueryBody.join("%20");
//     fetch (`https://api.spotify.com/v1/search?q=${changedQueryBody}&type=artist,track`,{
//         headers: {
//             "Authorization": `Bearer ${req.params.token}`
//         }
//     })
//     .then(resp => resp.json)
//     .then(data => res.json(data));
// })

// POST request for user to insert song ratings into DB 
// request is recieved from RatingComponent.js (frontend) and processed in handleRatingRequest.js (backend)
router.post('/ratings', async (req, res) => {
    try {
      const { uID, musicID, rating, title, artist } = req.body;
      console.log('\n','Request body:', req.body, '\n');
      await handleRatingRequest(req, res);
      res.status(200).send('Rating submitted');
    } catch (error) {
      console.error('Error submitting rating:', error);
      res.status(500).send('Internal server error');
    }
  });


//   // PUT request for user to update songs ratings in DB
//   router.put('/ratings', async (req, res) => {
//     try{
//         const { userID, musicID, rating } = req.body;
//         await handleRatingRequest('update', userID, musicID, rating); 
//         res.status(200).send('Rating updated');
//     } catch (error) {
//         console.error('Error updating rating: ', error);
//         res.status(500).send('Internal server error');
//     }
//   });

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


//    // DELETE request for use to retrieve songs from DB
//    router.delete('./ratings', async (req,res) => {
//     try{
//         const {userID, musicID, rating} = req.body;
//         await handleRatingRequest('get', userID, musicID, rating);
//         res.status(200).send('Rating deleted');
//     }catch(error){
//         console.error('Error deleting rating: ', error);
//         res.status(500).send('Internal server error');
//     }
//    });



module.exports = router;
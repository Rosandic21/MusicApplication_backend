const express = require ("express");
const router = express.Router();
const fetch = require("node-fetch");
const encodeFormData =  require("../helperFunctions/encodeFormData.js");
const querystring = require("querystring");

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
    res.redirect(`http:localhost:3000/${query}`)
});
})

// get user token to make a fetch request to spotify for user data
router.get("/getUser/:token", async(req, res) => {
    await fetch("https://api.spotify.com/v1/me",{
        headers: {
            "Authorization": `Bearer${req.params.token}`
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

// let user search for songs
router.post("/search/:token", async (req,res) =>{
    // split body so it can be encoded in the query
    let unchangedQueryBody = req.body.message.split(" ");
    let changedQueryBody = unchangedQueryBody.join("%20");
    fetch (`https://api.spotify.com/v1/search?q=${changedQueryBody}&type=artist,track`,{
        headers: {
            "Authorization": `Bearer ${req.params.token}`
        }
    })
    .then(resp => resp.json)
    .then(data => res.json(data));
})

module.exports = router;
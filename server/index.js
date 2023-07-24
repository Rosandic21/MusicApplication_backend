const express = require('express');
const app = express();

// route the HTTP GET requests to root '/api'
app.get("/api", (req, res) => {
   // res.send("Get request called");
    res.json({ "users": ["userOne", "userTwo", "userThree"] });
});
// for the function above, we first need to listen on the port for the HTTP get request
const PORT = process.env.PORT || 5000; // look for environment variable (hosts default port) and if not found then assign port 5000
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
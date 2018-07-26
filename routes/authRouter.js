var express = require('express');
var router = express.Router();

const { Auth } = require("models");

// login
router.post("/auth/login", (req, res) => {
    console.log(res);
});

// signup
router.post("/auth/signup", (req, res) => {
    console.log(res);
});

// refresh token
router.post("/auth/refresh", (req, res) => {
    console.log(res);
});


module.exports = router;
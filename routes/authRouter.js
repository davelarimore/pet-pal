var express = require('express');
var router = express.Router();

const { Auth } = require("../models");

// login: authenticate a user
router.post("/auth/login", (req, res) => {
    console.log(res);
});

// signup: add a new user
router.post("/auth/signup", (req, res) => {
    console.log(res);
});

// refresh token: refresh the token of an authenticated user
router.post("/auth/refresh", (req, res) => {
    console.log(res);
});


module.exports = router;
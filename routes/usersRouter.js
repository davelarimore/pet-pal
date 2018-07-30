var express = require('express');
var router = express.Router();

const { User } = require("../models");

// GET: all my clients, authenticated providers only
router.get("/clients", (req, res) => {
  User
  .find()
  .then(User => res.json(
      User.map(post => post.serialize())
  ))
  .catch(err => {
    console.error(err);
    res.status(500).json({message: "Inernal server error"})
  });
});

// GET one of my clients by ID, accessible by authenticated provider only
router.get("/:id", (req, res) => {
  User
  .findById(req.params.id)
  .then(post => res.json(post.serialize()))
  .catch(err => {
      console.error(err);
      res.status(500).json({message: "Internal server error"});
  })
})

// GET users/me: - get my client object only, accessible by any authenticated user

//POST: create a user via the signup forms, or by an authenticated provider via "add client"
router.post("/", (req, res) => {
  const requiredFields = ["firstName", "lastName", "email", "phone", "address", "provider", "password"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    companyName: req.body.companyName, //required for provider?
    email: req.body.email,
    phone: req.body.lastName,
    vetInfo: req.body.vetInfo,
    address: {
      addressString: req.body.phone,
      entryNote: req.body.entryNote,
    },
    provider: req.body.provider,
    password: req.body.password
  });
  res.status(201).json(item);
});

//PUT: update authenticated user (update me), or update client of an authenticated provider 
router.put("/:id", (req, res) => {
  const requiredFields = ["firstName", "lastName", "email", "phone", "address", "provider"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${
      req.params.id
    }) and request body id ``(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating user \`${req.params.id}\``);
  const updatedItem = User.update({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    companyName: req.body.companyName,
    email: req.body.email,
    phone: req.body.lastName,
    vetInfo: req.body.vetInfo,
    address: {
      addressString: req.body.phone,
      entryNote: req.body.entryNote,
    },
  });
  res.status(200).json(updatedItem);
});

//DELETE N/A

module.exports = router;

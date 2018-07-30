var express = require('express');
var router = express.Router();

const { Pet } = require("../models");

//GET: get all "my" pets for authenticated client, or all of an authenticated provider's client's pets
router.get("/", (req, res) => {
    Pet
    .find()
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Inernal server error"})
    });
  });

// GET by ID: get one pet belonging to the authenticated client, or belonging to the client of an authenticated provider
router.get("/:id", (req, res) => {
    Pet
    .findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: "Internal server error"});
    })
})

//POST: add a pet to the authenticated client, or to the client of an authenticated provider
router.post("/", (req, res) => {
  const requiredFields = ["user", "name", "type"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
    }
  }
  const item = Pet.create({
    user: req.body.user,
    name: req.body.name,
    type: req.body.type,
    breed: req.body.breed,
    color: req.body.color,
    food: req.body.food,
  });
    res.status(201).json(item);
});

//PUT: update pet belonging to the authenticated client, or belonging to the client of an authenticated provider
router.put("/:id", (req, res) => {
  const requiredFields = ["name", "type"];
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
  console.log(`Updating pet \`${req.params.id}\``);
  const updatedItem = Pet.update({
    name: req.body.name,
    type: req.body.type,
    breed: req.body.breed,
    color: req.body.color,
    food: req.body.food,
  });
  res.status(200).json(updatedItem);
});

// DELETE: delete pet belonging to the authenticated client, or belonging to the client of an authenticated provider
router.delete("/:id", (req, res) => {
  Pet.delete(req.params.id);
  console.log(`Deleted pet \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;

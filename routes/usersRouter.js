var express = require('express');
var router = express.Router();

const { User } = require("models");

// GET
router.get("/", (req, res) => {
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

// GET by ID
router.get("/:id", (req, res) => {
  User
  .findById(req.params.id)
  .then(post => res.json(post.serialize()))
  .catch(err => {
      console.error(err);
      res.status(500).json({message: "Internal server error"});
  })
})

//POST
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
    companyName: req.body.companyName,
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

//PUT
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

//DELETE
// router.delete("/:id", (req, res) => {
//   User.delete(req.params.id);
//   console.log(`Deleted shopping list item \`${req.params.ID}\``);
//   res.status(204).end();
// });

module.exports = router;

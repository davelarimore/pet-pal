var express = require('express');
var router = express.Router();

const { Visit } = require("../models");

//GET
router.get("/", (req, res) => {
    Visit
    .find()
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Inernal server error"})
    });
  });

//POST
router.post("/", (req, res) => {
  const requiredFields = ["user", "client", "startTime", "endTime", "recurrence"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
    }
  }
  const item = Visit.create({
    user: req.body.user,
    client: req.body.client,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    recurrence: req.body.recurrence
  });
    res.status(201).json(item);
});

//PUT N/A

// DELETE
router.delete("/:id", (req, res) => {
  Visit.delete(req.params.id);
  console.log(`Deleted visit \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;

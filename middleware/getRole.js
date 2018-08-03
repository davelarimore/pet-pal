const Users = require('../models/usersModel');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const getRole = (req, res, next) => {
    console.log("Handling get role");
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, JWT_SECRET);
        } catch (e) {
            res.status(401).send('unauthorized');
        }
        const userId = decoded.user.id;
        // Fetch the user by id 
        Users.findOne({ _id: userId })
            .then(user => {
                console.log(user.role);
                return res.json({ role: user.role })
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' })
            })
        next();
    }
};

module.exports = getRole;


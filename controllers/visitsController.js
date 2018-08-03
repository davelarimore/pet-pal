const Visits = require('../models/visitsModel');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//GET: get all visits belonging to an authenticated provider
exports.visitsGetList = (req, res) => {
    Visits
        .find({'provider': req.params.id })
        .then(visits => {
            res.json(visits)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        });
}

//GET upcoming visit for my client
exports.visitsGetClientUpcoming = (req, res) => {
    Visits
        .find({'client': req.params.id })
        .sort('-startTime')
        .limit(1)
        .then(visit => res.json(visit))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        });
}

//POST: add a visit for the client of an authenticated provider (client's can't add visits)
exports.visitsPost = (req, res) => {
    Visits
        .create({
            provider: req.body.provider,
            client: req.body.client,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            recurrence: req.body.recurrence,
        })
        .then(visit => res.status(201).json(visit))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
}

// DELETE: delete a visit for the client of an authenticated provider (client's can't delete visits)
exports.visitsDelete = (req, res) => {
    Visits
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({ message: 'Visit deleted' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
}
////////////////////////////////
// AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//GET my upcoming visit 
exports.visitsGetMyUpcoming = (req, res) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, JWT_SECRET);
        } catch (e) {
            res.status(401).send('unauthorized');
        }
        console.log(decoded);
        const userId = decoded.user.id;
        console.log(userId);
        // Fetch the tasks by client id 
        Visits.find({ client: userId })
            .sort('-startTime')
            .limit(1)
            .then(visit => {
                res.json(visit);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' })
            })
    }
};
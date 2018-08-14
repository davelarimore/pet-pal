const Users = require('../models/usersModel');
const Visits = require('../models/visitsModel');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

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
    if (req.user.clients.includes(req.body.client)) {
        Visits
            .create({
                providerId: req.body.providerId,
                client: req.body.client,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                recurrence: req.body.recurrence,
            })
            .then(() => {
                //get provider and return their populated doc
                return Users.findOne({ '_id': req.body.providerId })
                    .populate('pets')
                    .populate({ path: 'visits', populate: { path: 'client', model: 'Users' }, options: { sort: { startTime: -1 } } })
                    .populate('tasks')
                    .populate('provider')
                    .populate('clients')
            })
            .then(user => res.status(201).json(user))
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
            });
    }
}

// DELETE: delete a visit for the client of an authenticated provider (client's can't delete visits)
exports.visitsDelete = (req, res) => {
    if (req.user.visits.includes(req.params.id)) {
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
}

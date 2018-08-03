'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

///////////////////////////
//User
///////////////////////////

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true, default: '' },
    lastName: { type: String, required: true, default: '' },
    companyName: { type: String }, // provider only
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    vetInfo: { type: String }, // client only
    addressString: { type: String },
    latLon: { type: String },
    entryNote: { type: String },
    role: { type: String, required: true, default: "client" },
    password: { type: String, required: true }
})

// Virtual to generate full name
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.methods.serialize = function () {
    return {
        id: this._id,
        firstName: this.firstName,
        companyName: this.companyName,
        email: this.email,
        phone: this.phone,
        vetInfo: this.vetInfo,
        addressString: this.addressString,
        latLon: this.latLon,
        entryNote: this.entryNote,
        provider: this.provider,
        clients: this.clients,
        visits: this.visits,
        tasks: this.tasks,
    };
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('Users', userSchema, 'users');
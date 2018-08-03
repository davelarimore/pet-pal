'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

///////////////////////////
//User
///////////////////////////

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true, default: '' },
    lastName: { type: String, required: true, default: '' },
    companyName: { type: String, default: '' }, // provider only
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: '' },
    vetInfo: { type: String, default: '' }, // client only
    addressString: { type: String, default: '' },
    latLon: { type: String, default: '' },
    entryNote: { type: String, default: '' },
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
        lastName: this.lastName,
        companyName: this.companyName,
        email: this.email,
        phone: this.phone,
        vetInfo: this.vetInfo,
        addressString: this.addressString,
        latLon: this.latLon,
        entryNote: this.entryNote,
        role: this.role
    };
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('Users', userSchema, 'users');
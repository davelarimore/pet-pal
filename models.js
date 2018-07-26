"use strict";

const mongoose = require("mongoose");

///////////////////////////
//User
///////////////////////////

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true },
    companyName: { type: String }, // provider only
    email: { type: String, required: true },
    phone: { type: String, required: true },
    vetInfo: { type: String }, // client only
    address: {
        addressString: { type: String, required: true },
        latLon: { type: String },
        entryNote: { type: String }
    },
    provider: { type: Boolean, required: true }, // false = client
    clients: { type: Array }, // provider has many
    visits: { type: Array }, // provider has many
    pets: { type: Array }, // client has many
    tasks: { type: Array }, // client has many
    password: { type: String, required: true }
})

// Virtual to generate full name
userSchema.virtual("fullName").get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
userSchema.methods.serialize = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    companyName: this.companyName,
    email: this.email,
    phone: this.phone,
    vetInfo: this.vetInfo,
    address: {
      addressString: this.addressString,
      latLon: this.latLon,
      entryNote: this.entryNote
    },
    provider: this.provider,
    clients: this.clients,
    visits: this.visits,
    tasks: this.tasks,
  };
};

const User = mongoose.model("user", blogSchema);

module.exports = { User };

///////////////////////////
//Pet
///////////////////////////

const petSchema = mongoose.Schema({
    user: { type: String, required: true },  // user who owns it
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String },
    color: { type: String },
    food: { type: String }
})

const Pet = mongoose.model("pet", blogSchema);

module.exports = { Pet };

///////////////////////////
//Visit
///////////////////////////

const visitSchema = mongoose.Schema({
    user: { type: String, required: true }, // user who owns it
    client: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    recurrence: { type: String, required: true }
})

const Visit = mongoose.model("visit", blogSchema);

module.exports = { Visit };

///////////////////////////
//Task
///////////////////////////

const taskSchema = mongoose.Schema({
    user: { type: String, required: true },  // user who owns it
    description: { type: String, required: true },
    completed: { type: Boolean },
})

const Task = mongoose.model("task", blogSchema);

module.exports = { Task };
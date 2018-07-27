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
    role: { type: String, required: true, default:"client"}, 
    clients: [{ type: Mongoose.Schema.Types.ObjectId, ref: "User" }], // provider has many
    provider: { type: Mongoose.Schema.Types.ObjectId, ref: "User" }, // client has one
    visits: { type: Array }, // provider has many, referenced
    pets: { type: Array }, // client has many, referenced
    tasks: { type: Array }, // client has many, referenced
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

const User = mongoose.model("User", userSchema);

///////////////////////////
//Pet
///////////////////////////

const petSchema = mongoose.Schema({
    user: { type: String, required: true },  // user who owns it, referenced
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String },
    color: { type: String },
    food: { type: String }
})

const Pet = mongoose.model("Pet", petSchema);

///////////////////////////
//Visit
///////////////////////////

const visitSchema = mongoose.Schema({
    user: { type: String, required: true }, // user who owns it, referenced
    client: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    recurrence: { type: String, required: true }
})

const Visit = mongoose.model("Visit", visitSchema);

///////////////////////////
//Task
///////////////////////////

const taskSchema = mongoose.Schema({
    user: { type: String, required: true },  // user who owns it, referenced
    description: { type: String, required: true },
    completed: { type: Boolean },
})

const Task = mongoose.model("Task", taskSchema);

module.exports = { User, Pet, Visit, Task };
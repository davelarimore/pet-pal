

##User
```javascript
const userSchema = mongoose.Schema({
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true },
    companyName: { type: String }, // provider only
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    vetInfo: { type: String }, // client only
    address: {
        addressString: { type: String, required: true },
        latLon: { type: String, required: true },
        entryNote: { type: String }
    }
    provider: { type: Boolean, required: true }, // false = client
    // client: { type: Boolean, required: true }
    clients: { type: Array }, // provider has many
    visits: { type: Array }, // provider has many
    pets: { type: Array }, // client has many
    tasks: { type: Array } // client has many
})
```

##Pet
```javascript
const petSchema = mongoose.Schema({
    user: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String },
    color: { type: String },
    photo: { type: String},
    food: { type: String }
})
```

##Visit
```javascript
const visitSchema = mongoose.Schema({
    user: { type: String, required: true }, // provider who owns it
    client: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    recurrence: { type: String, required: true }
})
```

##Task
```javascript
const taskSchema = mongoose.Schema({
    user: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, required: true },
})
```
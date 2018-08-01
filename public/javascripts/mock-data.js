const PROVIDERS_STORE = [{
    id: 101,
    companyName: "Jane's Pet Care",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@test.biz",
    phone: "555-555-5555",
    vetInfo: "",
    address: {
        addressString: "123 Main",
        latLon: "0,0",
        entryNote: "Door code: 1234"
    },
    provider: true
},
{
    id: 102,
    companyName: "Dog Walkers Inc.",
    firstName: "Bob",
    lastName: "Doe",
    email: "bob@test.biz",
    phone: "555-555-5555",
    vetInfo: "",
    address: {
        addressString: "123 Main",
        latLon: "0,0",
        entryNote: "Door code: 1234"
    },
    provider: true
},
{
    id: 103,
    companyName: "",
    firstName: "Jane",
    lastName: "Doe",
    email: "john@test.biz",
    phone: "555-555-5555",
    vetInfo: "City Vet",
    address: {
        addressString: "123 Main",
        latLon: "0,0",
        entryNote: "Door code: 1234"
    },
    provider: false
}];

const CLIENTS_STORE = [{
    id: 201,
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe", 
    companyName: "",
    email: "john@test.biz",
    phone: "555-555-5555",
    vetInfo: "City Vet",
    address: {
        addressString: "123 Main",
        latLon: "0,0",
        entryNote: "Door code: 1234"
    },
    provider: "", // false = client
    clients: "", // provider has many
    visits: "", // provider has many
    pets: "", // client has many
    tasks: "" // client has many
},
{
    id: 202,
    firstName: "Jane",
    lastName: "Doe",
    fullName: "Jane Doe", 
    companyName: "",
    email: "jane@test.biz",
    phone: "555-555-5555",
    vetInfo: "City Vet",
    address: {
        addressString: "123 Main",
        latLon: "0,0",
        entryNote: "Door code: 1234"
    },
    provider: "", // false = client
    clients: "", // provider has many
    visits: "", // provider has many
    pets: "", // client has many
    tasks: "" // client has many
},
{
    id: 203,
    firstName: "Sally",
    lastName: "Doe",
    fullName: "Sally Doe", 
    companyName: "",
    email: "sally@test.biz",
    phone: "555-555-5555",
    vetInfo: "City Vet",
    address: {
        addressString: "123 Main",
        latLon: "0,0",
        entryNote: "Door code: 1234"
    },
    provider: "", // false = client
    clients: "", // provider has many
    visits: "", // provider has many
    pets: "", // client has many
    tasks: "" // client has many
}];

const VISITS_STORE = [{
    id: 301,
    providerID: 101,
    client: "John Doe",
    startTime: "June 29, 10:00 AM",
    endTime: "June 29, 10:30 AM",
    recurrence: null,
},
{
    id: 302,
    providerID: 101,
    client: "John Doe",
    startTime: "June 30, 9:00 AM",
    endTime: "June 30, 9:00 AM",
    recurrence: null,
},
{
    id: 303,
    providerID: 101,
    client: "John Doe",
    startTime: "June 31, 9:00 AM",
    endTime: "June 31, 9:00 AM",
    recurrence: null,
},
{
    id: 304,
    providerID: 101,
    client: "John Doe",
    startTime: "July 1, 9:00 AM",
    endTime: "July 1, 9:00 AM",
    recurrence: null,
},
{
    id: 305,
    providerID: 101,
    client: "John Doe",
    startTime: "July 2, 9:00 AM",
    endTime: "July 2, 9:00 AM",
    recurrence: null,
}];

const PETS_STORE = [{
    id: 401,
    client: 201,
    name: "Fluffy",
    type: "Cat",
    breed: "Tabby",
    color: "Grey",
    photo: "",
    food: "Purina"
},
{
    id: 402,
    client: 201,
    name: "Caramel",
    type: "Cat",
    breed: "Tabby",
    color: "Tan",
    photo: "",
    food: "Purina"
},
{
    id: 403,
    client: 201,
    name: "Snowball",
    type: "Cat",
    breed: "Tabby",
    color: "White",
    photo: "",
    food: "Purina"
}];

const TASKS_STORE = [{
    id: 501,
    description: "Feed animals",
    completed: false,
},
{
    id: 502,
    description: "Get mail",
    completed: false,
},
{
    id: 503,
    description: "Walk dog",
    completed: false,
}];
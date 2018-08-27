# Pet Pals

## About:
Pet Pals helps pet care providers and their clients share information about their pets and services. Users can sign up as either a client or a provider (dog walker, pet sitter). The app is especially helpful for providers, since they can access client and pet details at all times via their mobile device.

### Client features:
* Can update their user profile and contact information
* Can add, edit and delete pets
* Can add and delete tasks for the pet care provider to complete at each scheduled visit
* Can view the next visit tht their provider has scheduled

### Provider features:
* Can update their user profile and contact information
* Can add, update or delete clients
* Can add, edit and delete pets for their clients
* Can add and delete tasks for their clients 
* Can add and delete visits for their clients

### Achitecture highlights:
* The Mongo database has separate models for users, pets, visits and tasks. The models utilize relationships to manage ownership of records.
* Navigo provides front-end routing for the one-page app

## Technology used:
* bcryptjs
* Chai/Chai-http
* CSS
* Express.js
* Git/GitHub
* Heroku
* HTML
* JavaScript
* JSON Web Token
* jQuery
* mLab
* Mocha
* Mongo DB
* Mongoose
* Navigo.js
* Node.js
* Passport.js
* Postman
* Travis CI

## API Documentation

## Access and testing:
Users can access the application at the below URL:
https://petpals-app.herokuapp.com/

Users can create new users in the app or use an existing test user below:

Test Provider:
jenny@lane.biz

Test Client:
john@doe.biz

Password for test users:
1234567890

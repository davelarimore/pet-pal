##Users
```javascript
// add new user
router.post("/users", (req, res) => {
  console.log(res);
});
// get all users, or by last name, etc. via query
router.get("/users", (req, res) => {
  console.log(res);
});
// update user
router.put("/users/:id", (req, res) => {
  console.log(res);
});
// delete user
router.delete("/users/:id", (req, res) => {
  console.log(res);
});
  ```

##Pets
```javascript
// add a pet to a client
router.post("/users/:id/pets", (req, res) => {
  console.log(res);
});
// get all of a client's pets
router.get("/users/:id/pets", (req, res) => {
  console.log(res);
});
// get one of a client's pets
router.get("/users/:id/pets/:id", (req, res) => {
  console.log(res);
});
// update one of a client's pets
router.put("/users/:id/pets/:id", (req, res) => {
  console.log(res);
});
// delete one of a client's pets
router.delete("/users/:id/pets/:id", (req, res) => {
  console.log(res);
});
```

##Visits
```javascript
// add a visit to a provider
router.post("/users/:id/visits", (req, res) => {
  console.log(res);
});
// get all of a provider's visits
router.get("/users/:id/visits", (req, res) => {
  console.log(res);
});
// get one of a provider's visits
router.get("/users/:id/visits/:id", (req, res) => {
  console.log(res);
});
// delete one of a provider's visits
router.delete("/users/:id/visits/:id", (req, res) => {
  console.log(res);
});
```

##Tasks
```javascript
// add a task to a client
router.post("/users/:id/tasks", (req, res) => {
  console.log(res);
});
// get all of a client's tasks
router.get("/users/:id/tasks", (req, res) => {
  console.log(res);
});
// delete one of a client's tasks
router.delete("/users/:id/tasks/:id", (req, res) => {
  console.log(res);
```

##Auth
```javascript
// login
router.post("/auth/login", (req, res) => {
  console.log(res);
});
// signup
router.post("/auth/signup", (req, res) => {
  console.log(res);
});
// refresh token
router.post("/auth/refresh", (req, res) => {
  console.log(res);
});
```
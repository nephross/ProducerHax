'use strict';
const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./../../lib/middleware/auth');
const multer = require('./../../lib/middleware/multer');
const userController = require('./../../controllers/users/users.controller.js');

// ::V1 endpoint: POST /api/users/
router.post('/users', auth.extractIP, multer.upload.single('profile_picture'), (req, res, next) => {
  userController.createUser(req.body, req.ip, 3) // The second param(3) is to give the users made on this route the userRole of member
    .then((result) => res.set('x-access-token', result.token).json(result.user))
    .catch(next);
});

// ::V1 endpoint: GET /api/users
router.get('/users', auth.authenticateJWT, (req, res, next) => {
  userController.getUsers()
    .then((users) => res.json(users))
    .catch(next);
});

// ::V1 endpoint: GET /api/users/:userId
router.get('/users/:userId', auth.authenticateJWT, (req, res, next) => {
  userController.getUser(req.params.userId)
    .then((user) => res.json(user))
    .catch(next);
});

// ::V1 endpoint: PUT /api/users
router.put('/users/:userId', auth.authenticateJWT, multer.upload.single('profile_picture'), (req, res, next) => {
  userController.updateUser(req.params.userId, req.body)
    .then((user) => res.json(user))
    .catch(next);
});

module.exports = router;

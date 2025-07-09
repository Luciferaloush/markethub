const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const auth = require('../middleware/auth');
router.get('/profile', auth, userController.profile);
router.post('/edit-profile', auth, userController.editProfile);
router.get('/user-profile/:id', auth, userController.usersProfie);
module.exports = router;
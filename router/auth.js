const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const upload = require('../middleware/upload');
router.post('/register',upload.fields([
    { name: 'image', maxCount: 1 },
  ]), authController.register);
router.post('/login', authController.login);


module.exports = router;
const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
router.get('/category', auth, categoryController.getCategories);
router.post('/add-category', admin, categoryController.addCategory);
module.exports = router;
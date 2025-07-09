const express = require('express');
const router = express.Router();
const productController = require('../controller/product');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
router.post('/add-product',upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]), auth, productController.addProduct);
router.get('/my-product', auth, productController.myProduct);
router.put('/product/:id', auth, productController.updateProduct);
router.delete('/product/:id', auth, productController.deleteProduct);
router.get('/all-product', auth, productController.allProduct);
router.get('/single-product/:id', auth, productController.singleProduct);

module.exports = router;
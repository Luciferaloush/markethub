const express = require('express');
const router = express.Router();
const subscriptionController = require('../controller/subscription');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
router.put('/update', auth, subscriptionController.updateSubscription);
router.get('/plans', auth, subscriptionController.getPlans);
router.get('/all-subscription', admin, subscriptionController.getAllSubscriptions);

module.exports = router;
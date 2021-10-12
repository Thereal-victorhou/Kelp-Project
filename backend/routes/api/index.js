const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const restaurantRouter = require('./restaurants.js');

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/restaurants', restaurantRouter);



module.exports = router;

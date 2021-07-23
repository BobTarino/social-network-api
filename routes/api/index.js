// prefix endpoint names and package them up
const router = require('express').Router();
const thoughtRoutes = require('./thought-routes');
const userRoutes = require('./user-routes');

// add prefixes to routes (ex: '/comments')
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;
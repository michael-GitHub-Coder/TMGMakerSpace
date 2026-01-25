const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signin', authController.signin);


// Protect all routes after this middleware
router.use(authController.protect);

// Example protected route
router.get('/me', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});



module.exports = router;



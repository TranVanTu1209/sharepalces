const express = require('express');
const { getUsers, login, signup } = require('../controllers/users.');
const { check } = require('express-validator');
const router = express.Router();
const fileUpload = require('../middlewares/file-upload');


router.get('/', getUsers);

router.post('/login', [
  check('email', 'Email must not be empty').normalizeEmail().isEmail(),
  check('password', 'Password mus be at least 8 characters').isLength({ min: 8 })
], login);

router.post('/signup', fileUpload.single('image'), 
[
  check('name', 'Name must not be empty').not().isEmpty(),
  check('email', 'Email must not be empty').normalizeEmail().isEmail(),
  check('password', 'Password mus be at least 8 characters').isLength({ min: 8 })
],
 signup);

module.exports = router;
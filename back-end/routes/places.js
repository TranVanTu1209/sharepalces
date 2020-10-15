const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace } = require('../controllers/places');
const fileUpload = require('../middlewares/file-upload');
const checkAuth = require('../middlewares/check-auth');

router.get('/user/:uid', getPlacesByUserId);

router.get('/:pId', getPlaceById);

router.use(checkAuth);

router.post('/', fileUpload.single('image'), [
  check('title', 'Title must not be empty').not().isEmpty(),
  check('description', 'Description must be at least 6 characters').isLength({ min: 6 }),
  check('address', 'Address must not be empty').not().isEmpty(),
], createPlace);

router.patch('/:pId', [
  check('title', 'Title must not be empty').not().isEmpty(),
  check('description', 'Description must be at least 6 characters').isLength({ min: 6 })
], updatePlace);

router.delete('/:pId', deletePlace);

module.exports = router;
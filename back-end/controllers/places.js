const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../utils/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pId;
  let place;
  try
  {
    place = await Place.findById(placeId);
  } catch (error)
  {
    const err = new HttpError('Something went wrong', 500);
    return next(err);
  }
  if (!place)
  {
    const error = new HttpError('Could not find a place for a provided id', 404);
    return next(error);
  }
  return res.json({ place: place.toObject({ getters: true }) });
}

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces;
  try
  {
    userWithPlaces = await User.findById(userId).populate('places')
  } catch (error)
  {
    const err = new HttpError('Could not find places for a provided user id', 500);
    return next(err);
  }
  if (!userWithPlaces)
  {
    const error = new HttpError('Could not find a place for a provided user id', 404);
    return next(error);
  }
  res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty())
  {
    const error = new HttpError('Invalid inputs passed, please check your data', 422);
    return next(error);
  }
  const { title, description, address } = req.body;

  const newPlace = new Place({
    title,
    description,
    address,
    creator: req.userData.userId,
    location: getCoordsForAddress(address),
    image: req.file.path
  });
  let user;
  try
  {
    user = await User.findById(req.userData.userId).select('-password');
  } catch (error)
  {
    console.log(error);
    const err = new HttpError('Server error when create place', 500);
    return next(err);
  }
  if (!user)
  {
    const err = new HttpError('Could not find user for provided id', 404);
    return next(err);
  }
  try
  {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newPlace.save({ session });
    user.places.push(newPlace);
    await user.save({ session });
    await session.commitTransaction();
    return res.status(201).json({ place: newPlace, user: user });
  } catch (error)
  {
    console.log(error);
    const err = new HttpError('Server error when create place 2', 500);
    return next(err);
  }
}

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    const error = new HttpError('Invalid inputs passed, please check your data', 422);
    return next(error);
  }
  const { title, description } = req.body;
  const placeId = req.params.pId;
  let updatedPlace;

  try
  {
    updatedPlace = await Place.findById(placeId);
  } catch (error)
  {
    const err = new HttpError('Something went wrong.Could not update this place', 500);
    return next(err);
  }
  if (!updatedPlace)
  {
    const err = new HttpError('Could not find this place', 404);
    return next(err);
  }

  if (updatedPlace.creator.toString() !== req.userData.userId.toString())
  {
    return next(new HttpError('You could not update this place', 401));
  }
  updatedPlace.title = title;
  updatedPlace.description = description;

  try
  {
    await updatedPlace.save();
  } catch (error)
  {
    const err = new HttpError('Something went wrong. Could not update this place', 500);
    return next(err);
  }

  return res.json({ place: updatedPlace.toObject({ getters: true }) });
}

const deletePlace = async (req, res, next) => {

  const placeId = req.params.pId;

  let place;

  try
  {
    place = await Place.findById(placeId).populate('creator');
  } catch (error)
  {
    const err = new HttpError('Something went wrong. Server error', 500);
    return next(err);
  }
  if (!place)
  {
    const err = new HttpError('Could not find this place', 404);
    return next(err);
  }
  if (place.creator.id.toString() !== req.userData.userId.toString())
  {
    return next(new HttpError('You could not delete this place', 401));
  }
  const imagePath = place.image;
  try
  {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error)
  {
    const err = new HttpError('Something went wrong.Server error. Can not delete place', 500);
    return next(err);
  }
  fs.unlink(imagePath, err => {
    console.log(err);
  });
  return res.json({ message: 'Deleted Place Successfully' });
}

module.exports = {
  getPlaceById: getPlaceById,
  getPlacesByUserId: getPlacesByUserId,
  createPlace: createPlace,
  updatePlace: updatePlace,
  deletePlace: deletePlace
}
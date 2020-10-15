const API_KEY = process.env.GOOGLE_MAP_API_KEY;
// const location_token = '411a4a5e18bdb7';
// const axios = require('axios');
const HttpError = require('../models/http-error');

function getCoordsForAddress(address) {
  return {
    lat: (Math.random() * 300).toFixed(5),
    lng: (Math.random() * 300).toFixed(5)
  }
  // const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
  // const data = res.data;
  // if (!data || data.status === 'ZERO_RESULTS')
  // {
  //   const error = new HttpError('Could not find location', 422);
  //   throw error;
  // }
  // console.log(data);
  // const coordinates = data.results[0].geometry.location;
  // return coordinates;
}

module.exports = getCoordsForAddress;
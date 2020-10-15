const express = require('express');
const HttpError = require('./models/http-error');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// middlewares config
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type , X-Requested-With, Accept, Authorization');
  next();
});

app.use('/api/places', require('./routes/places'));

app.use('/api/users', require('./routes/users'));

// 404 routes
app.use((req, res, next) => {
  const error = new HttpError('Could not find any data for this route', 404);
  throw error;
});

// error occur
app.use((error, req, res, next) => {
  if (req.file)
  {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent)
  {
    return next(error);
  }
  res.status(error.code || 500).json({ message: error.message || 'Unknown error occur' });
});

const PORT = process.env.PORT || 5000;

// connect to db
mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zoqd5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    }, (err) => {
      if (err)
      {
        console.log(err);
        process.exit(1);
      }
      app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
      console.log('Mongodb connected');
    });


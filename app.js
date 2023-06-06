const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: new mongoose.Types.ObjectId('647ee447b86353260e9bf314'),
  };
  next();
});

app.use(router);

app.listen(3000, () => {
  console.log('Server is listenning on port 3000');
});

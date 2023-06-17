const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

app.use(router);

app.listen(3000, () => {
  console.log('Server is listenning on port 3000');
});

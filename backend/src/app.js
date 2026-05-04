const express = require('express');
const initLoaders = require('./loaders');

const app = express();

initLoaders(app);

module.exports = app;

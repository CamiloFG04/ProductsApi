const express = require('express');
const morgan = require('morgan');
const productsRouter = require('../routes/product.router');
const usersRouter = require('../routes/user.router');
const productsUserRouter = require('../routes/productsUser.router');
const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/api/v1/products',productsRouter);
app.use('/api/v1/users',usersRouter);
app.use('/api/v1/productsUsers',productsUserRouter);


module.exports = app;
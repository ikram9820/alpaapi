const express = require('express')
const users = require('../routes/users');
const auth = require('../routes/auth')
module.exports = function(app){
    app.use(express.json());
    app.use('/api/v1/auth',auth);
    app.use('/api/v1/users',users);
}
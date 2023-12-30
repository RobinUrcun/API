const bodyParser = require('body-parser');
const express = require('express')
const mongoose = require('mongoose')
const path = require('path');
const saucesRoutes = require('./routes/sauces')
const usersRoutes = require('./routes/users')

mongoose.connect('mongodb+srv://projetpiiquante:pncfMHUoYtC02Mpu@piiquante.wsfhvey.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });



app.use('/api/sauces', saucesRoutes)

app.use('/api/auth', usersRoutes)

app.use('/images', express.static(path.join(__dirname, 'images')))



module.exports = app

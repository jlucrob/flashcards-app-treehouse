const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();

// Set up mongoose connection
// Atlas project: FlashCardsApp, cluster: FlashCardsApp, username: admin, password: adminpw
const dev_db_url = 'mongodb://admin:adminpw@flashcardsapp-shard-00-00-z4lha.mongodb.net:27017,flashcardsapp-shard-00-01-z4lha.mongodb.net:27017,flashcardsapp-shard-00-02-z4lha.mongodb.net:27017/studyApp?ssl=true&replicaSet=FlashCardsApp-shard-0&authSource=admin';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// // mongodb connection
// mongoose.connect("mongodb://localhost:27017/studyApp");
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));

db.once("open", function(){
  console.log("db connection successful");
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use('/static', express.static('public'));

app.set('view engine', 'pug');

const mainRoutes = require('./routes');
const cardRoutes = require('./routes/cards');

app.use(mainRoutes);
app.use('/cards', cardRoutes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});
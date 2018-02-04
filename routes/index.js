const express = require('express');
const router = express.Router();
//const { data } = require('../data/flashcardData.json');
let StudyCard = require('../models/models');

router.get('/', (req, res) => {
  res.clearCookie('topicCardsAvailable');
  const name = req.cookies.username;

  if (name) {
    //Load data and send the collection to index.pug
    StudyCard.find({}, (err, studycards)=>{
      if(err){
        return next(err);
      } else {
        res.render('index', { name, studycards });
      }
    }).sort({'_id':1});

  } else {
    res.redirect('/hello');
  }
});

router.get('/hello', (req, res) => {
  res.clearCookie('topicCardsAvailable');
  const name = req.cookies.username;
  if (name) {
    res.redirect('/');
  } else {
    res.render('hello');
  }
});

router.post('/hello', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/');
});

router.post('/goodbye', (req, res) => {
  res.clearCookie('username');
  res.clearCookie('topicCardsAvailable');
  res.redirect('/hello');
});

router.get('/edit-cards', (req, res, next) => {
  res.clearCookie('topicCardsAvailable');
  const name = req.cookies.username;
  if (name) {
    StudyCard.find({}, (err, studycards)=>{
      if(err){
        return next(err);
      } else {
        res.render('edit-cards', {studycards: studycards});
      }
    });

  } else {
    res.redirect('/');
  }
});

// Delete a topic
router.delete('/edit-cards', (req, res, next) => {
  const topicToDel = req.query.toDel;

  StudyCard.remove({title:topicToDel}, (err)=>{
    if(err){
      return next(err);
    }
    res.send('Success');
  });
});

// Add new topic/question to database
router.post('/edit-cards', (req, res, next) => {

  let cardsArray = [];
  let currentQuestionObj = {};
  let counter = 0;
  for(let key in req.body){

    if(/^[0-9][QHA]$/.test(key)){
      // if(counter === 0){
      //   currentQuestionObj.question = req.body[key];
      // } else if (counter === 1){
      //   currentQuestionObj.hint = req.body[key];
      // } else if (counter === 2) {
      //   currentQuestionObj.answer = req.body[key];
      // }

      if(/Q$/.test(key)){
        currentQuestionObj.question = req.body[key];
      } else if (/H$/.test(key)){
        currentQuestionObj.hint = req.body[key];
      } else if (/A$/.test(key)) {
        currentQuestionObj.answer = req.body[key];
      }

      counter++;

      if(counter >= 3){
        counter = 0;
        cardsArray.push(currentQuestionObj);
        currentQuestionObj = {};
      }
    }
  }

  let newTopic = new StudyCard({title:req.body.newTopicTitle, cards: cardsArray});
  
  newTopic.save( (err, newTopic)=>{
    if(err) return next(err);
    res.redirect('/edit-cards');
  });  
});

module.exports = router;
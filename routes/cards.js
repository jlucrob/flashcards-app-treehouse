const express = require('express');
const router = express.Router();
const mid = require('../middleware');
let StudyCard = require('../models/models');

//Pre load the Topic document into req.topic when ever the param studyTopicIndex is present
router.param("studyTopicIndex", (req, res, next, idString) => {
  StudyCard.find({}, function(err, topics){
    if(err) return next(err);

    const id = parseInt(idString, 10);

    if(!topics || !topics[id]){
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
  
    req.topic = topics[id]; 
    return next();
  }).sort({'_id':1});
});

//Get /cards
router.get( '/', ( req, res ) => {
  const studyTopicIndex = req.query.studyTopicIndex;
  //If there is a query with a studyTopicIndex we redirect to the correct card page.
  //If not, we redirect to topic selection screen
  //Ex: /cards?studyTopicIndex=2). We redirect to /cards/2
  if(!studyTopicIndex){
    return res.redirect('/');
  }
  res.redirect( `/cards/${studyTopicIndex}` );
});

//Get /cards/0 or /cards/1, etc
router.get('/:studyTopicIndex', mid.manageCardsAvailableCookie, (req, res) => {
  const studyTopicIndex = req.params.studyTopicIndex;
  const studyTopic = req.topic;

  //We make sure to have a topic index and a topic object (from our route.param middleware)
  if(!studyTopicIndex || !studyTopic){
    return res.redirect('/');
  }

  //Here we have a valid study topic and index. 
  //We will find a random card ID (amongst cards still available in cookie)
  //Then find this card in the study topic cards
  //and redirect to the right card page

  const studyTopicCards = studyTopic.cards;
  let availableCards = req.cookies.topicCardsAvailable.cards;

  if(availableCards.length === 0){
    availableCards = studyTopicCards;
  }
  
  const numberOfCards = availableCards.length;
  const randomCardIdFromAvai = Math.floor( Math.random() * numberOfCards );
  const cardQuestionFromAvai = availableCards[randomCardIdFromAvai].question;
  let cardIdInStudyTopic = 0;

  studyTopicCards.forEach((currentCard, index)=>{
    if(currentCard.question === cardQuestionFromAvai){
      cardIdInStudyTopic = index;
      availableCards.splice(randomCardIdFromAvai, 1);
    }
  });

  res.cookie('topicCardsAvailable', {'topicIndex': studyTopicIndex, 'cards':availableCards});
  res.redirect( `/cards/${studyTopicIndex}/${cardIdInStudyTopic}` );
});

//Get /cards/0/0 or /cards/1/5, etc
router.get( '/:studyTopicIndex/:cardId', ( req, res ) => {
  const studyTopicIndex = req.params.studyTopicIndex;
  const studyTopic = req.topic;

  //We make sure to have a topic index and a topic object (from our route.param middleware)
  if(!studyTopicIndex || !studyTopic){
    return res.redirect('/');
  }

  const cards = studyTopic.cards;
  const studyTopicTitle = studyTopic.title;
  const cardIdString = req.params.cardId;

  //We make sure the card ID we have is a valid card in the topic.
  //And that we have a topic title
  //If not, we redirect
  if(isNaN(cardIdString) || !cards[cardIdString] || !studyTopicTitle){
    return res.redirect(`/cards/${studyTopicIndex}`);
  }

  const cardId = parseInt(cardIdString, 10);

  //We fetch the data from the query string in the url (?side=question)
  const { side } = req.query;
  //If there is no side, we redirect with the same topic and card id with the "question" side
  if ( !side ) {
      return res.redirect(`/cards/${studyTopicIndex}/${cardId}?side=question`);
  }

  const name = req.cookies.username;
  const text = cards[cardId][side];
  const { hint } = cards[cardId];
  
  //We have all the data needed to send to our card.pug template
  const templateData = {cardId, text, name, side, studyTopicIndex, studyTopicTitle};

  //If the side is "question" we show hint and set "answer" for the "switch side" button
  //If the side is "answer" we hide the hint and set "question" for the "switch side" button
  if ( side === 'question' ) {
    templateData.hint = hint;
    templateData.switchSide = 'answer';
  } else if ( side === 'answer' ) {
    templateData.switchSide = 'question';
  }
  
  res.render('card', templateData);
});

module.exports = router;
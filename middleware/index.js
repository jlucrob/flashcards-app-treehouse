let manageCardsAvailableCookie = (req, res, next) => {
  // When this function is called, we are garanteed to have a 
  // req.params.studyTopicIndex that is valid in database
  const cardsCookie = req.cookies.topicCardsAvailable;
  let topicIndex = parseInt(req.params.studyTopicIndex, 10);

  //Initiate the cookie showing which cards are available to current topic
  if(!cardsCookie || (cardsCookie.topicIndex != topicIndex)){
    res.cookie('topicCardsAvailable', {'topicIndex': topicIndex, 'cards':req.topic.cards});
    return res.redirect( `/cards/${topicIndex}` );
  }
  return next();
}

module.exports.manageCardsAvailableCookie = manageCardsAvailableCookie;
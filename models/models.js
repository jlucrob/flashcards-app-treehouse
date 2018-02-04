let mongoose = require('mongoose');

var CardsSchema = new mongoose.Schema({
  question: {type: String, required: true, trim: true},
  hint: {type: String, required: true, trim: true},
  answer: {type: String, required: true, trim: true}
});

var TopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  cards: [CardsSchema]
});

// var DataSchema = new mongoose.Schema({
//   data: [TopicSchema]
// });

//NOTE: mongoose.model looks for the collection studycards. 
//It takes the name you give it, makes all letters lowercase and makes it plural
var StudyCard = mongoose.model('StudyCard', TopicSchema);
module.exports = StudyCard;
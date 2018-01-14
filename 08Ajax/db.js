const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//using mongoose models
const placeSchema = mongoose.Schema({
  name: String,
  cuisine: String,
  location: String
});

mongoose.model('Place', placeSchema);

mongoose.connect('mongodb://localhost/hw08', {useMongoClient: true});


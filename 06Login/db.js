const mongoose = require('mongoose');

const User = new mongoose.Schema({
	username: {type: String, unique: true},
	password: String,
});

mongoose.model('User', User);

mongoose.connect('mongodb://localhost/hw06');
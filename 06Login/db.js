const mongoose = require('mongoose');

const User = new mongoose.Schema({
	usr: {type: String, unique: true, sparse: true},
	pwd: String,
});

mongoose.model('User', User);

mongoose.connect('mongodb://localhost/hw06');
//requirements
const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs');

//my schema goes here!
const Comment = new mongoose.Schema({
	text: String,
	user: String,
});
const Link = new mongoose.Schema({
	url: String,
	title: String,
	votes: {type: Number, default: 0},
	comments: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]},
});
Link.plugin(URLSlugs('title'));

mongoose.model('Comment', Comment);
mongoose.model('Link', Link);

mongoose.connect('mongodb://localhost/hw05');

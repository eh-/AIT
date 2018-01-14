const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Bring in mongoose model, Place, to represent a restaurant
const Place = mongoose.model('Place');

// TODO: create two routes that return json
// GET /api/places
// POST /api/places/create
// You do not have to specify api in your urls
// since that's taken care of in app.js when
// this routes file is loaded as middleware
router.get('/places', (req, res) => {
	const query = {};
	if(req.query.location)
		query.location = req.query.location;
	if(req.query.cuisine != "")
		query.cuisine = req.query.cuisine;
	Place.find(query, function(err, places){
		if(err)
			console.log(err);
		else
			res.json(places);
	});
});

router.post('/places/create', (req, res) => {

});

module.exports = router;

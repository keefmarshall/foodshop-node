/**
 * Methods for retrieving/saving food objects
 */

var db = require("../mongodb.js");
var ObjectId = require("mongojs").ObjectId;

exports.get = function(req, res)
{
	if (req.params.foodid)
	{
		// fetch one food object
		db.foods.findOne(
				{"name" : req.params.foodid},
				{"name": 1, "type" : 1, "_id" : 0},
				function(err, food) {
			if (err || !food)
			{
				res.status(404).send("Food " + req.params.foodid + " not found!");
			}
			else
			{
				food.instock = { "href" : "http://localhost:3000/foods/" + req.params.foodid + "/instock" };
				res.json(food);
			}
		});
	}
	else
	{
		db.foods.find(function(err, foods) {
			// TODO error checking
			res.json(foods);
		});
	}

};

exports.post = function(req, res)
{
	if (req.is("application/json") && req.body)
	{
		var food = req.body; // should be a json object
		console.log("Got food = " + JSON.stringify(food));
		// first check if food exists, if so, do an update
		db.foods.findOne({"name" : food.name}, function(err, found) {
			if (found)
			{
				console.log("Updating existing object");
				food._id = found._id;
			}

			db.foods.save(food, function(err, saved) {
				if (!err)
				{
					res.json(saved);
				}
				else
				{
					res.status(500).send(err);
				}
				
			});
		});
		
	}
	else
	{
		console.log("unsupported input: not json!");
	}
};

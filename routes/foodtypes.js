/**
 * Methods for fetching food types / foods belonging to types
 */

var db = require("../mongodb.js");

exports.get = function(req, res)
{
	// OK foodtype is not an entity in Mongo, it's just a property of a food.

	// if we have a foodtype ID specified, we need to feth foods with that type
	var foodtypeid = req.params.foodtypeid;
	if (foodtypeid)
	{
		db.foods.find({"type.foodtype" : foodtypeid}, { "name" : 1, "_id" : 0}, function (err, foods) {
			// We need to add an href to each food:
			for (var i = 0; i < foods.length; i++)
			{
				foods[i].href = "http://localhost:3000/foods/" + foods[i].name;
			}
			res.json(foods);
		});
	}
	else // return a list of food types
	{
		db.foods.distinct("type", function (err, types){
			if (!err && types)
			{
				res.json(types);
			}
			else
			{
				res.status(500).send(err);
			}
		});
	}
};

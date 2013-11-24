/**
 * Methods for fetching food types / foods belonging to types
 */

var db = require("../mongodb.js");

exports.get = function(req, res)
{
	// like foodtypes, stores aren't entities in their own right in mongo
	// This is almost identical to the foodtypes code
	// if we have a foodtype ID specified, we need to feth foods with that type
	var storeid = req.params.storeid;
	if (storeid)
	{
		db.foods.find({"stock.storename" : storeid}, { "name" : 1, "stock" : 1, "_id" : 0}, function (err, foods) {
			// We need to add an href to each food:
			for (var i = 0; i < foods.length; i++)
			{
				foods[i].href = "http://localhost:3000/foods/" + foods[i].name;
				// we only want instock for the current store:
				for (var j = 0; j < foods[i].stock.length; j++)
				{
					if (foods[i].stock[j].storename == storeid)
					{
						foods[i].instock = foods[i].stock[j].instock;
					}
				}
				delete foods[i].stock;
			}
			res.json(foods);
		});
	}
	else // return a list of food types
	{
		db.foods.distinct("stock.storename", function (err, storenames){
			if (!err && storenames)
			{
				var stores = [];
				// need to add URI
				for (var i = 0; i < storenames.length; i ++)
				{
					var store = {};
					store.name = storenames[i];
					store.href = "http://localhost:3000/stores/" + storenames[i];
					stores.push(store);
				}
				res.json(stores);
			}
			else
			{
				res.status(500).send(err);
			}
		});
	}
	
};

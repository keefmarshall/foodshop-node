/**
 * Methods for food stock status, by food
 */

var db = require("../mongodb.js");

exports.get = function(req, res)
{
	var foodid = req.params.foodid; // required
	var storeid = req.params.storeid; // optional
	
	if (!storeid)
	{
		db.foods.findOne(
				{"name" : foodid},
				{"name": 1, "stock" : 1, "_id" : 0},
				function(err, food) {
			if (err || !food)
			{
				res.status(404).send("Food " + foodid + " not found!");
			}
			else
			{
				food.href = "http://localhost:3000/foods/" + foodid;
				res.json(food);
			}
		});
	}
	else
	{
		db.foods.findOne({"name" : foodid}, {"stock" : 1, "_id" : 0}, function (err, food) {
			if (err || !food)
			{
				res.status(404).send("Food " + foodid + " not found!");
			}
			else
			{
				var instock = false;
				for (var i = 0; i < food.stock.length; i++)
				{
					console.log("got storeid = " + storeid + ", storename = " + food.stock[i].storename);
					if (food.stock[i].storename == storeid)
					{
						instock = food.stock[i].instock;
					}
				}
				
				var result = {};
				result.food = {
						"name" : foodid, 
						"href" : "http://localhost:3000/food/" + foodid 
				  };
				result.store = {
						"storename" : storeid,
						"href" : "http://localhost:3000/store/" + storeid 
				  };
				result.instock = instock;
				
				res.json(result);
			}
		});
	}
};

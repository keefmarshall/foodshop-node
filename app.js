
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

var foods = require('./routes/foods');
var foodsInstock = require('./routes/foods-instock');
var foodtypes = require("./routes/foodtypes");
var stores = require("./routes/stores");

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// ROUTES START HERE

app.get('/', routes.index);


app.get('/foods', foods.get);
app.post('/foods', foods.post);
app.get('/foods/:foodid', foods.get);

app.get('/foods/:foodid/instock', foodsInstock.get);
app.get('/foods/:foodid/instock/:storeid', foodsInstock.get);

app.get("/foodtypes", foodtypes.get);
app.get("/foodtypes/:foodtypeid", foodtypes.get);

app.get("/stores", stores.get);
app.get("/stores/:storeid", stores.get);
app.get("/stores/:storeid/instock/:foodid", foodsInstock.get);

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// START HTTP SERVER

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

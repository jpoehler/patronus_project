var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var patronus = express.Router();
var pg = require('pg');
var app = express();


var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/patronus_database';
}


patronus.post('/', function(req, res) {
  console.log('body: ', req.body);
  var patronus_name = req.body.patronus_name;

  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];


      var query = client.query('INSERT INTO patronus (patronus_name) VALUES ($1) ' +
                                'RETURNING id, patronus_name', [patronus_name]);

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});


patronus.get('/', function(req, res) {
  //console.log('body: ', req.body);
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;

  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];


      var query = client.query('SELECT * FROM patronus ORDER BY id DESC;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        return res.json(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});


module.exports = patronus;

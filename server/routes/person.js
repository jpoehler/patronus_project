var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var person = express.Router();
var pg = require('pg');
var app = express();

var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/patronus_database';
}

//----we need to finish this update route--
person.put('/', function(req, res) {
  console.log('body: ', req.body);
  var personID = req.body.id;
  // var first_name = req.body.first_name;
  // var last_name = req.body.last_name;
  var patronus_id = req.body.patronus_id;

  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];


      var query = client.query('INSERT INTO people (first_name, last_name) VALUES ($1, $2) ' +
                                'RETURNING id, first_name, last_name', [first_name, last_name]);

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



person.post('/', function(req, res) {
  console.log('body: ', req.body);
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


      var query = client.query('INSERT INTO people (first_name, last_name) VALUES ($1, $2) ' +
                                'RETURNING id, first_name, last_name', [first_name, last_name]);

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


person.get('/', function(req, res) {
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


      var query = client.query('SELECT * FROM people ORDER BY id DESC;');

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



module.exports = person;

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var person = require('./routes/person');
var patronus = require('./routes/patronus');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/people', person);
app.use('/patronus', patronus);

//OUR GET/POST/PUT CALLS HERE<>
//----------------------
var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/patronus_database';
}

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('Error connecting to DB!', err);
    //TODO end process with error code
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS people (' +
                              'id SERIAL PRIMARY KEY,' +
                              'first_name varchar(80) NOT NULL,' +
                              'last_name varchar(80) NOT NULL,'+
                              'patronus_id int REFERENCES patronus (id));'
    );

    query.on('end', function(){
      console.log('Successfully ensured schema exists');
      done();
    });

    query.on('error', function(error) {
      console.log('Error creating schema!', error);
      //TODO exit(1)
      done();
    });
  }
});






app.get('/*', function(req, res){
  var filename = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '/public/', filename)); // ..../server/public/filename
});

app.listen(port, function(){
  console.log('Listening for requests on port', port);
});

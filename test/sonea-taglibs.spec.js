var express = require('express');

var taglibs = require('..');

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname+"/views");

app.use(taglibs(app, {}));

app.get('/', function(req, res) {
  res.render('test');
});

var request = require('supertest')(app);

describe('SoneaTablibs', function() {
  it("sould response 200", function(done) {
    request.get('/')
    .expect(200, done);
  });
});

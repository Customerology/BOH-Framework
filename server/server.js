'use strict';

const express = require('express');
const app = express();
const cors = require('cors');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '50mb' })); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
app.use(cors(corsOptions));

app.get('/', function (req, res) {
  res.status(200).json({ success: true, message: 'Api working.' });
});

require('./api')(app);

//
// HTTP-static
//
app.use(express.static('./'));

// Start the server
const PORT = process.env.PORT || 1111;
app.listen(PORT, function () {
  console.log('App listening on port ' + PORT);
  console.log('Press Ctrl+C to quit.');
});

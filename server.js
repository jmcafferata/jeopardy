const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
// get port, corsUrl and originPort from config.json
const port = 5500
let corsUrl = "34.68.132.80"
const originPort = 5501
let debug = false;
if (debug) {
  corsUrl = '127.0.0.1';
}
 //

app.use(cors({ origin: `http://${corsUrl}:${originPort}` }));

app.use(express.json()); // This line is necessary to be able to parse JSON from the request body
// Check if scores.json exists, and if not, create it
fs.access('scores.json', fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFile('scores.json', '[]', (err) => {
      if (err) throw err;
    });
  }
});

app.get('/scores', (req, res) => {
  fs.readFile('scores.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send(JSON.parse(data));
    }
  });
});

app.post('/scores', (req, res) => {
  fs.readFile('scores.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      let scores = JSON.parse(data);
      scores.push(req.body);
      fs.writeFile('scores.json', JSON.stringify(scores), (err) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          res.send({ message: 'Score successfully saved' });
        }
      });
    }
  });
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));

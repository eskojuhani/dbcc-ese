var express = require("express");
var cors = require('cors')
const util = require('util');

var app = express();
app.use(express.json());
app.use(cors())

app.use(function(req, res, next) {
  origin = "*";

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'auth_provider,access_token,Content-Type,Request header,Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'auth_provider,access_token,Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (req.method == "OPTIONS") {
    res.status(200);
    res.send();
  } else {
    next();
  }
});

app.post('/analyze', function(req, res) {
  res.charset = 'utf-8';
  analyze(req.body)
    .then(result => {
      res.status(200).send(result);
      return;
    })
    .catch(err => {
      res.status(500).send({error: err.toString(), input: req.body });
    });
});

const isAlpha = str => /^[a-zA-Z]*$/.test(str);

function analyze(body) {
  return new Promise((resolve, reject) => {
    try {
      var input = JSON.parse(JSON.stringify(body));
      var inputText = input.text.replace(/[^\x00-\x7F]/g,"");

      var words = 0;
      var spaces = 0;

      var prevWasSpace = true;
      var chars = [...inputText].reduce(function( a, c) {
        if (c in a) {
          a[c]++;
          prevWasSpace = false;
        }
        else if (c == ' ') {
          words += (prevWasSpace ? 0 : 1)
          spaces++;
          prevWasSpace = true;
        }
        else {
          a[c] = 1;
          prevWasSpace = false;
        }
        return a
      }, {});
      words += (prevWasSpace ? 0 : 1)

      chars = Object.keys(chars).filter(key => {
        return isAlpha(key)
      }).sort().reduce((a, c) => ({ ...a, ...{ [c]: chars[c] } }), {});

      var result = {
        "textLength": {"withSpaces": inputText.length, "withoutSpaces": inputText.length - spaces},
        "wordCount": words,
        "characterCount": [chars]
      };
      return resolve(result);
    } catch (err) {
      return reject(err);
    }
  });
}

module.exports = app;
/*
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
*/

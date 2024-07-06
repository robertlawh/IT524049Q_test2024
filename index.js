var getRawBody = require('raw-body');
const currency = require('./currency-api.js'); //load the currency api
const getCurrency = currency.getCurrency;
const addCurrency = currency.addCurrency;
const listCurrency = currency.currency;

//var getFormBody = require('body/form');
//var body = require('body');


exports.handler = (req, resp, context) => {
  // split handler
  const s1 = req.path.split("/")[1];
  const s2 = req.path.split("/")[2];
  const s3 = req.path.split("/")[3];

  switch (req.method) {
    case "GET":
      if (req.path == `/currency/${s2}`) {
        const name = getCurrency(s2).name;
        const symbol = getCurrency(s2).symbol;
        const description = getCurrency(s2).description;

        resp.setStatusCode(200);
        resp.send(JSON.stringify({
          "name": name,
          "symbol": symbol,
          "description": description
        }))
      }
      else if (req.path == `/rate/${s2}`) {
        const rate = getCurrency(s2).rate;
        resp.setStatusCode(200);
        resp.send(JSON.stringify({ "rate": rate }));
        console.log(rate);

      } else if (req.path == `/rate/${s2}/${s3}`) {
       const rate  =getCurrency(s2).rate;

        if (s2 == "USD") {
          resp.setStatusCode(200);
          resp.send(JSON.stringify({ "exchange": parseFloat(s3) }));
        }
        else if (s2 == "EUR") {
          resp.setStatusCode(200);
          const exchange = parseFloat(s3) * rate;
          resp.send(JSON.stringify({ "exchange": exchange.toFixed(2) }));
        }
      }
      else {
        resp.setStatusCode(400);
        resp.send(JSON.stringify({ status: "400", description: `Bad Request.` }));
      }
      break;
    // POST HKD
    case "POST":
      if (req.path == "/currency") {
        getRawBody(req, function (err, body) {
          try {
            const id = JSON.parse(body.toString()).id;
            const name = JSON.parse(body.toString()).name;
            const symbol = JSON.parse(body.toString()).symbol;
            const rate = JSON.parse(body.toString()).rate;
            const description = JSON.parse(body.toString()).description;

            addCurrency(id, name, symbol, rate, description);
            resp.send(JSON.stringify({ status: "201", description: `New currency added.` }));
          }
          catch (err) {
            resp.setStatusCode(501);
            resp.send(JSON.stringify({ status: "501", description: `Unsuccessful.` }));

          }
        });
      }
      else {
        resp.setStatusCode(400);
        resp.send(JSON.stringify({ status: "400", description: `Bad Request.` }));
      }
      break;

    default:
      resp.setStatusCode(400);
      resp.send(JSON.stringify({ status: "400", description: `Bad Request.` }));
      break;
  }

}
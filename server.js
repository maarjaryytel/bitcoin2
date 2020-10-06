const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const ejs = require("ejs");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/style", express.static(__dirname + "public/style"));
app.use("/style", express.static(__dirname + "public/images"));

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("", (req, res) => {
  res.render("index.ejs", { currency: "", number: "", code: "" });
});

app.post("/", (req, res) => {
  let url = "https://api.coindesk.com/v1/bpi/currentprice/eur.json";
  let currency = req.body.currency;
  let number = req.body.number;

  axios
    .get(url)
    .then(function (response) {
      console.log(response.data);
      let rate;
      let code;
      let calculations;

      if (currency === "EUR") {
        rate = response.data.bpi.EUR.rate_float;
        code = response.data.bpi.EUR.code;
        calculations = (rate * number).toFixed(2);
      } else {
        rate = response.data.bpi.USD.rate_float;
        code = response.data.bpi.USD.code;
        calculations = (rate * number).toFixed(2);
      }

      res.render("index.ejs", {
        currency: calculations,
        code: code,
      });
    })

    .catch(function (error) {
      console.log(error);
    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server has started.");
});

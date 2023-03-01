const express = require("express");
const axios = require('axios')
const cors = require('cors')

const app = express();
const { resolve } = require("path");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


app.use(express.static(process.env.STATIC_DIR));
app.use(cors());
app.use(express.json())
app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.get('/secret', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 2000,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 1991,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.post('/split-payement', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
    });
    // CREATE CONNECTED ACCOUNT IN STRIPE //
    // const account = await stripe.accounts.create({
    //   country: 'US',
    //   type: 'custom',
    //   capabilities: {card_payments: {requested: true}, transfers: {requested: true}},
    // });
    // Create a Transfer to the connected account (later):
    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: currency,
      destination: 'acct_1MgNpQGgzaip4SeJ',
    });

    // Create a second Transfer to another connected account (later):
    // const secondTransfer = await stripe.transfers.create({
    //   amount: amount,
    //   currency: currency,
    //   destination: 'acct_1MgN5XSAIOPV5W8m',
    // });

    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error.message
    });
  }
});

app.post("/create-charges", async (req, res) => {
  const data = { "amount": 3000, "currency": 'usd', "source": 'tok_visa', "description": 'My First Test Charge', "capture": 'false' }
  try {
    axios.post('https://api.stripe.com/v1/charges', data, { headers: { "Content-Type": 'application/x-www-form-urlencoded', Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } }).then(response => {
      res.send({
        response: response.data,
      });
    }).catch(error => console.log(error))
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.post("/capture-payement", async (req, res) => {
  const body = {};
  const Url = 'https://api.stripe.com/v1/charges/' + req.body.chargeId + '/capture';
  try {
    axios.post(Url, body, { headers: { "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}` } }).then(response => {
      res.send({
        response: response.data,
      });
    }).catch(error => res.status(400).send(error.response.data))
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.listen(5252, () =>
  console.log(`Node server listening at http://localhost:5252`)
);

import React, { useState, useEffect } from 'react';
import {
  CardElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

const CaptureAndPayLater = () => {
  const [amount, setAmount] = useState(0);
  const [stripe, setStripePromise] = useState(null);
  const [charge, setChargeRes] = useState(null)

  useEffect(() => {
    fetch("/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch('/create-charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: amount, currency: 'usd' })
    }).then((response) => response.json())
    .then((data) => setChargeRes(data?.response?.id));
      // .catch((error) => {
      //   console.error("Error:", error);
      // });
    // var { result } = await response.json();
    // setChargeRes(result);
    // response && setChargeRes(response.json())
    // const { clientSecret } = await response.json();

    // const result = await stripe.confirmCardPayment(clientSecret);

    // if (result.error) {
    //   console.error(result.error.message);
    // } else {
    //   console.log(result.paymentIntent);
  };

  const capturePayement = async () => {
    const response = await fetch('/capture-payement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chargeId: charge })
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <CardElement />
        <button type="submit">
          Pay
        </button>
      </form>
      <button onClick={capturePayement}>
        Complete payement
      </button>
    </>
  );
};

export default CaptureAndPayLater;
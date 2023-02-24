import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

// let stripePromise;

// const getStripe = () => {
//   if (!stripePromise) {
//     stripePromise = loadStripe("pk_test_51MeFmHSFKAGdjXJ4DJbqUw7JPTGEir5xIViDXnMoikTNO9HK8UStxLotDAFbLInNYGknMikUSYPyPXSy1vMWkL6V00uGG7HKLU");
//   }

//   return stripePromise;
// };

const SubscriptionPlan = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    fetch("/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);
  const item = {
    // pass product price key //
    price: "price_1MeFznSFKAGdjXJ4Q0cutZlw", 
    quantity: 1
  };

  const checkoutOptions = {
    lineItems: [item],
    mode: "payment",
    successUrl: `${window.location.origin}/success`,
    cancelUrl: `${window.location.origin}/cancel`
  };

  const redirectToCheckout = async () => {
    setLoading(true);
    console.log("redirectToCheckout");
    //  get stripe or its instance  //
    // const stripe = await getStripe();
    const stripe = await stripePromise
    // pass checkout Options //
    const { error } = await stripe.redirectToCheckout(checkoutOptions);
    console.log("Stripe checkout error", error);

    if (error) setStripeError(error.message);
    setLoading(false);
  };

  if (stripeError) alert(stripeError);

  return (
    <div className="checkout">
      <h2>Subscription Plan</h2>
      <p className="checkout-title"></p>
      <p className="checkout-description">
      </p>
      <h3 className="checkout-price">₹40.00</h3>
      <button
        className="checkout-button"
        onClick={redirectToCheckout}
        disabled={isLoading}
      >
        <div className="grey-circle">
          <div className="purple-circle">
            {/* <img className="icon" src={CardIcon} alt="credit-card-icon" /> */}
          </div>
        </div>
        <div className="text-container">
          <p className="text">{isLoading ? "Loading..." : "Buy"}</p>
        </div>
      </button>
    </div>
  );
};

export default SubscriptionPlan;

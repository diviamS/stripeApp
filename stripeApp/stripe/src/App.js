import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Routes, Route } from "react-router-dom";
import Header from "./common/Header";
import SubscriptionPlan from "./components/SubscriptionPlan";
import SimplePayement from "./components/SimplePayement";
import Completion from "./components/checkout/Completion";
import CaptureAndPayLater from "./components/CaptureAndPayLater";
import SplitPayement from "./components/SplitPayement";

function App() {
  const [stripePromise, setStripePromise] = useState(null);
  useEffect(() => {
    fetch("/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);
  return (
    <Elements stripe={stripePromise} >
    <div className="App">
      <Header />
        <Routes>
          <Route path="/" element={<SimplePayement />} />
          <Route path="/simplepayment" element={<SimplePayement />} />
          <Route path="/completion" element={<Completion />} />
          <Route path="/subscriptionplan" element={<SubscriptionPlan />} />
          <Route path="/capture" element={<CaptureAndPayLater />} />
          <Route path="/payemensplit" element={<SplitPayement />} />
        </Routes>
    </div>
    </Elements>
  );
}

export default App;

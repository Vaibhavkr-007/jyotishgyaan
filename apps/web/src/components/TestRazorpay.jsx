import React from "react";

export default function TestRazorpay() {
  const pay = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/payments/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 500,
          }),
        }
      );

      const order = await response.json();

      console.log(order);

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Test Payment",
        description: "Testing Razorpay",
        order_id: order.orderId,

        handler: function (response) {
          console.log("SUCCESS", response);
          alert("SUCCESS");
        },

        modal: {
          ondismiss: function () {
            console.log("CLOSED");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.log("FAILED", response);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <button onClick={pay}>
        TEST RAZORPAY
      </button>
    </div>
  );
}
import React, { useState } from 'react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Load Stripe
const stripePromise = loadStripe('pk_test_51RMFu1P8UQ0pvaRLvSscEfOUdk0YKSRTdXUafiinbFud1kznVR3GyWWqphs6R5kGz3w6M3VY7qcNTqc0ilgTrCFI00eLpPMCGg');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreatePaymentIntent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }

    const totalAmount = parseFloat(localStorage.getItem('cartTotalAmount') || '0');
    if (totalAmount === 0) {
      setError('Cart is empty.');
      setLoading(false);
      return;
    }

    const amountInCents = Math.round(totalAmount * 100);
    if (amountInCents < 50) {
      setError('Total must be at least $0.50 to proceed.');
      setLoading(false);
      return;
    }

    const productIds = JSON.parse(localStorage.getItem('cartProductIds') || '[]');
    if (productIds.length === 0) {
      setError('No products in cart.');
      setLoading(false);
      return;
    }

    try {
      // Create Payment Intent
      const res = await axios.post('http://localhost:5000/api/create-payment-intent', {
        amount: amountInCents,
        userId,
        productIds
      });

      const secret = res.data.clientSecret;
      setClientSecret(secret);
      console.log('Client Secret:', secret);

      // Confirm Payment
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(secret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (paymentError) {
        console.error(paymentError);
        setError(paymentError.message);
        setLoading(false); // Stop loading on error
        return;
      }

      // Check if paymentIntent is successfully processed
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        setSuccessMsg('🎉 Payment successful!');

        // Save order after payment is successful
        await axios.post('http://localhost:5000/api/save-order', {
          userId,
          amount: totalAmount,
          products: productIds,
          paymentIntentId: paymentIntent.id,
          paymentStatus: paymentIntent.status
        });

        // Clear cart only after successful order save
        localStorage.removeItem('cartTotalAmount');
        localStorage.removeItem('cartProductIds');

        console.log('Order saved to database!');
      } else {
        setError('Payment failed or was canceled.');
      }
    } catch (err) {
      console.error('Payment error:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to process payment.');
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl mb-4 font-semibold">Checkout</h2>
      <form onSubmit={handleCreatePaymentIntent}>
        <CardElement className="border p-3 mb-3 rounded" />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      {clientSecret && (
        <p className="text-gray-600 mt-3 text-sm break-words">Client Secret: {clientSecret}</p>
      )}
      {error && <p className="text-red-500 mt-3">{error}</p>}
      {successMsg && <p className="text-green-600 mt-3 font-semibold">{successMsg}</p>}
    </div>
  );
};

const WrappedPaymentForm = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default WrappedPaymentForm;

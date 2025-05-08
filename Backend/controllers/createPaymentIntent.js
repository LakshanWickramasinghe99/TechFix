import Stripe from 'stripe';
import Payment from '../models/payment.js';   // ← use Payment

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  const {
    amount,
    customerId,
    customerName,
    customerEmail,
    address,
    items,
    totalAmount
  } = req.body;

  // Basic validation
  if (!amount || amount < 50) {
    return res.status(400).json({
      error: 'The amount must be greater than or equal to 50 cents.'
    });
  }
  if (!customerId || !customerName || !customerEmail || !address || !items || !totalAmount) {
    return res.status(400).json({
      error: 'Missing required payment fields.'
    });
  }

  try {
    // create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    // save a Payment document
    const payment = await Payment.create({
      customerId,
      customerName,
      customerEmail,
      address,
      items,
      totalAmount,
      status: 'Processing',
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({
      message: 'Payment failed',
      error: error.message
    });
  }
};

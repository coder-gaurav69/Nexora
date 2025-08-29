import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { TEST_KEY_ID,TEST_KEY_SECRET } from '../config.js';

const razorPayRoute = express.Router();

const razorpay = new Razorpay({
  key_id: TEST_KEY_ID,
  key_secret: TEST_KEY_SECRET,
});

// Create Razorpay order
razorPayRoute.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // amount in smallest currency unit
      currency: 'INR',
      receipt: 'order_rcptid_11',
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment
razorPayRoute.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', TEST_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    // console.log('verify hit hua')
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});

export default razorPayRoute;

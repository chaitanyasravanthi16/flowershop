const express = require('express');
const router = express.Router();
const Order = require('../model/order');

// POST - Create a new order
router.post('/order-now', async (req, res) => {
  try {
    const { productId, productName, productPrice, customerName, customerAddress, orderTime } = req.body;

    // Validate input
    if (!productId || !productName || !productPrice || !customerName || !customerAddress || !orderTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new order
    const newOrder = new Order({
      productId,
      productName,
      productPrice,
      customerName,
      customerAddress,
      orderTime,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating order',
      error: error.message,
    });
  }
});

module.exports = router;

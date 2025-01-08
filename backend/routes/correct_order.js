const router = require('express').Router();
const Order = require('../models/order');
const { authenticateToken } = require('./userAuth');
const Book = require('../models/book');
const User = require('../models/user');

// Place an order
router.post('/place_order', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers; // User ID from headers
        const { order } = req.body; // Order details from request body

        if (!id || !order || !Array.isArray(order)) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        for (const orderData of order) {
            if (!orderData._id) {
                return res.status(400).json({ message: "Invalid order data" });
            }

            // Create and save a new order
            const newOrder = new Order({
                user: id,
                book: orderData._id
            });
            const orderDataFromDB = await newOrder.save();

            // Add order to user model
            await User.findByIdAndUpdate(id, { $push: { orders: orderDataFromDB._id } });

            // Remove item from cart
            await User.findByIdAndUpdate(id, { $pull: { cart: orderData._id } });
        }

        return res.status(200).json({
            status: "success",
            message: "Order placed successfully"
        });
    } catch (error) {
        console.error("Error placing order:", error.message);
        return res.status(500).json({
            message: "Error occurred while placing order",
            error: error.message
        });
    }
});

// Get all orders
router.get('/get_all_orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: "book", // Populate book details
            })
            .populate({
                path: "user", // Populate user details
            })
            .sort({ createdAt: -1 }); // Sort by creation date (latest first)

        return res.status(200).json({
            status: "success",
            data: orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return res.status(500).json({
            message: "Error occurred while fetching orders",
            error: error.message
        });
    }
});

// Update order status (Admin only)
router.put('/update_order_status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers; // Order ID from headers
        const { status } = req.body; // Status from request body

        if (!id || !status) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Order status updated successfully",
            data: updatedOrder
        });
    } catch (error) {
        console.error("Error updating order status:", error.message);
        return res.status(500).json({
            message: "Error occurred while updating order status",
            error: error.message
        });
    }
});

module.exports = router;

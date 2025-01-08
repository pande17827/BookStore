const router = require('express').Router();
const User = require('../models/user');
const { authenticateToken } = require('./userAuth');

// Add book to cart
router.put('/add_book_to_cart', authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;

        // Check if required headers are present
        if (!bookid || !id) {
            return res.status(400).json({ message: "Missing required headers: 'bookid' and/or 'id'" });
        }

        // Fetch user data
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the book is already in the cart
        const isBookInCart = userData.cart && userData.cart.includes(bookid);
        if (isBookInCart) {
            return res.status(200).json({ message: "Book already in cart" });
        }

        // Add book to cart
        await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
        res.status(200).json({ message: "Book added to cart" });

    } catch (error) {
        console.error("Error adding book to cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Remove book from cart
router.put('/remove_book_from_cart', authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers; // Use request body to get bookid
        const { id } = req.headers;

        // Validate inputs
        if (!bookid || !id) {
            return res.status(400).json({ message: "Missing required fields: 'bookid' and/or 'id'" });
        }

        // Check if user exists
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the book exists in the cart
        const isBookInCart = userData.cart && userData.cart.includes(bookid);
        if (!isBookInCart) {
            return res.status(404).json({ message: "Book not found in cart" });
        }

        // Remove the book from the cart
        await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
        return res.status(200).json({ message: "Book removed from cart" });

    } catch (error) {
        console.error("Error removing book from cart:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// get books cart for a particular user
router.get('/get_user_cart', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        // Validate the 'id' header
        if (!id) {
            return res.status(400).json({ status: "error", message: "Missing required header: 'id'" });
        }

        // Fetch the user's cart and populate related data
        const userData = await User.findById(id).populate("cart");
        if (!userData) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // Reverse the cart array (if necessary)
        const cart = userData.cart.reverse();

        // Send the response
        return res.json({
            status: "success",
            data: cart
        });
    } catch (error) {
        console.error("Error fetching the cart:", error);
        return res.status(500).json({ status: "error", message: "Error during fetching the cart" });
    }
});



module.exports = router;

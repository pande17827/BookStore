const router = require('express').Router();
const User = require('../models/user');
const { authenticateToken } = require('./userAuth');

// Add book to favourites
router.put('/add_book_to_favourite', authenticateToken, async (req, res) => {
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

        // Check if the book is already in favourites
        const isBookFavourite = userData.favourites.includes(bookid);
        if (isBookFavourite) {
            return res.status(200).json({ message: "Book already in favourites" });
        }

        // Add book to favourites
        await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
        res.status(200).json({ message: "Book added to favourites" });

    } catch (error) {
        console.error("Error adding book to favourites:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



// remove book from favourites
router.put('/remove_book_from_favourite', authenticateToken, async (req, res) => {
    try{
        const {bookid,id}=req.headers
        const userData=await User.findById(id) 
        const isBookFavourite=userData.favourites.includes(bookid)
        if(isBookFavourite){
            await User.findByIdAndUpdate(id,{$pull:{favourites:bookid}})
            
        }
        res.status(200).json({message:"Book removed from favourites"})
        
    }
    catch(error){
        res.status(500).json({message:"Internal server error"})
    }
})

// get favourite books for a particular user
router.get('/get_favourite_books',authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers
        const userData=await User.findById(id).populate("favourites")
        const favouriteBooks=userData.favourites
        return res.json({
            status:"success",
            data:favouriteBooks
        })
    }
    catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
})

module.exports = router;

const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./userAuth');
const Book = require('../models/book');

// Add books -- for admin
router.post('/add_book', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        
        // Fetch user by ID from the database
        const user = await User.findById(id);
        
        // Check if the user has an 'admin' role
        if (user.role !== "admin") {
            return res.status(403).json({ message: "You are not an admin, therefore you do not have permission to add a book." });
        }

        // Check if all required fields are present
        const { url, title, author, price, desc, language } = req.body;
        if (!url || !title || !author || !price || !desc || !language) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Create and save the new book
        const book = new Book({
            url,
            title,
            author,
            price,
            desc,
            language
        });
        await book.save();

        res.status(200).json({ message: "Book added successfully." });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error." });
    }
}); 


// update books
router.put('/update_book', authenticateToken, async (req, res) => {
    try{
        const {bookid}=req.headers
        await Book.findByIdAndUpdate(bookid,{
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language
        })
        return res.status(200).json({message:"book updated successfully"})

    }catch(error){
        return res.status(500).json({message:"An error occured while adding books"})

    }
});

// delete books
router.delete('/delete_book', authenticateToken, async (req, res) => {
    try{
        const {bookid}=req.headers
        await Book.findByIdAndDelete(bookid)
        return res.status(200).json({message:"book deleted successfully"})
    }
    catch(error){
        return res
        .status(500)
        .json({message:"An error occured while adding books"})
    }
})

// get all books
router.get('/get_all_books', authenticateToken, async (req, res) => {
    try{
        const books=await Book.find().sort({createdAt:-1})
        return res.json(
            {
                status:"success",
                data:books
            }
        )
    }catch(error){
        return res
        .status(500)
        .json({message:"An error occured while displauing all books"})
    }
})

// get recently added books limited 4 books
router.get('/get_recently_added_books', authenticateToken, async (req, res) => {
    try{
        const books=await Book.find().sort({createdAt:-1}).limit(4)
        return res.json(
            {
                status:"success",
                data:books
            }
        )
    }catch(error){
        return res
        .status(500)
        .json({message:"An error occured while displauing all books"})
    }
})


// get book by id
router.get('/get_book_by_id/:id', authenticateToken, async (req, res) => {
    try{
        const {id}=req.params
        const book=await Book.findById(id)
        return res.json(
            {
                status:"success",
                data:book
            }
        )
    }catch(error){
        return res
        .status(500)
        .json({message:"An error occured book's information"})
    }
})

module.exports = router;

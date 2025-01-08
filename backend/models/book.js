const mongoose = require('mongoose');

const book = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true, // Corrected from `require` to `required`
    },
    author: {
        type: String,
        required: true, // Corrected from `require` to `required`
    },
    price: {
        type: Number,
        required: true, // Corrected from `require` to `required`
    },
    desc: {
        type: String,
        required: true, // Corrected from `require` to `required`
    },
    language: {
        type: String, // Corrected `string` to `String`
        required: true, // Corrected from `require` to `required`
    },
});

// Export the schema
module.exports = mongoose.model('books', book);

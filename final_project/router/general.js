const express = require("express");
const axios = require("axios");

// Import book database and authentication utilities
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// Create a new router instance for public endpoints
const public_users = express.Router();



// POST /register - Register a new user
// Request body: { username, password }
// Returns: Success message or error if user already exists
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    // Validate that both username and password are provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    // Check if username is not already in use
    if (!isValid(username)) {
        // Add the new user to the users list if username is unique
        users.push({
            username,
            password
        });

        return res.status(200).json({
            message: "User successfully registered. Now you can login."
        });
    }

    // Return conflict status if username already exists
    return res.status(409).json({
        message: "User already exists!"
    });

});




// GET / - Retrieve all books
// Uses async/await pattern with Axios to fetch books from the server
// Falls back to local books database if the server request fails
public_users.get("/", async (req, res) => {

    try {
        // Attempt to fetch books from the server using async/await
        const response = await axios.get("http://localhost:5000/books");

        return res.status(200).json(response.data);

    } catch (error) {
        // If the server request fails, return books from local database as fallback
        return res.status(200).json(books);

    }

});




// GET /isbn/:isbn - Retrieve a specific book by ISBN
// Parameters: isbn (required) - The ISBN identifier of the book
// Uses promise-based Axios with .then() and .catch() for error handling
// Falls back to local database if server request fails
public_users.get("/isbn/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    axios
        .get(`http://localhost:5000/books/${isbn}`)
        .then(response => {
            // Successfully received book data from server
            res.status(200).json(response.data);

        })
        .catch(() => {
            // Server request failed; attempt to retrieve from local database
            if (books[isbn]) {
                // Book found in local database
                return res.status(200).json(books[isbn]);

            }

            // Book not found in either location
            return res.status(404).json({
                message: "Book not found"
            });

        });

});




// GET /author/:author - Retrieve all books by a specific author
// Parameters: author (required) - The name of the author to search for
// Uses async/await pattern with Axios for asynchronous server request
// Implements intelligent fallback: filters local database by author on server failure
// Case-insensitive comparison ensures accurate matching regardless of case input
public_users.get("/author/:author", async (req, res) => {

    try {
        // Extract author name from request parameters
        const author = req.params.author;

        // Make async Axios request to server for books by this author
        const response = await axios.get(
            `http://localhost:5000/books/author/${author}`
        );

        // Return books successfully retrieved from server
        return res.status(200).json(response.data);

    } catch (error) {
        // Server request failed; implement fallback using local database
        // Convert author name to lowercase for case-insensitive comparison
        const author = req.params.author.toLowerCase();

        // Filter local books database: match books where author matches the query (case-insensitive)
        const filteredBooks = Object.values(books).filter(book =>
            book.author.toLowerCase() === author
        );

        // Return filtered results from local database
        return res.status(200).json(filteredBooks);

    }

});



// GET /title/:title - Retrieve all books by a specific title
// Parameters: title (required) - The title of the book to search for
// Uses async/await pattern with Axios for asynchronous server request
// Implements intelligent fallback: filters local database by title on server failure
// Case-insensitive comparison ensures accurate matching regardless of case input
public_users.get("/title/:title", async (req, res) => {

    try {
        // Extract title from request parameters
        const title = req.params.title;

        // Make async Axios request to server for books with this title
        const response = await axios.get(
            `http://localhost:5000/books/title/${title}`
        );

        // Return books successfully retrieved from server
        return res.status(200).json(response.data);

    } catch (error) {
        // Server request failed; implement fallback using local database
        // Convert title to lowercase for case-insensitive comparison
        const title = req.params.title.toLowerCase();

        // Filter local books database: match books where title matches the query (case-insensitive)
        const filteredBooks = Object.values(books).filter(book =>
            book.title.toLowerCase() === title
        );

        // Return filtered results from local database
        return res.status(200).json(filteredBooks);

    }

});



// GET /review/:isbn - Retrieve all reviews for a specific book
// Parameters: isbn (required) - The ISBN identifier of the book
// Returns: Reviews object containing all user reviews for the book
public_users.get("/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    // Check if book with specified ISBN exists in database
    if (books[isbn]) {
        // Return the reviews object for the book
        return res.status(200).json(books[isbn].reviews);

    }

    // Book with specified ISBN not found
    return res.status(404).json({
        message: "Book not found"
    });

});


// Export the public_users router for use in the main application
module.exports.general = public_users;
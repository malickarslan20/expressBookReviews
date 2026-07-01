const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register New User
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Unable to register user." });
    }

    if (!isValid(username)) {
        users.push({ username, password });
        return res.status(200).json({ message: "User successfully registered. Now you can login." });
    }

    return res.status(404).json({ message: "User already exists!" });
});

// Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn]);
});

// Get by Author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    const filtered = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
    );

    return res.status(200).json(filtered);
});

// Get by Title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;

    const filtered = Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
    );

    return res.status(200).json(filtered);
});

// Get Reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
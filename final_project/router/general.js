const express = require("express");
const axios = require("axios");

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();



public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required."
        });
    }

    if (!isValid(username)) {
        users.push({
            username,
            password
        });

        return res.status(200).json({
            message: "User successfully registered. Now you can login."
        });
    }

    return res.status(409).json({
        message: "User already exists!"
    });

});




public_users.get("/", async (req, res) => {

    try {

        const response = await axios.get("http://localhost:5000/books");

        return res.status(200).json(response.data);

    } catch (error) {

        return res.status(200).json(books);

    }

});




public_users.get("/isbn/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    axios
        .get(`http://localhost:5000/books/${isbn}`)
        .then(response => {

            res.status(200).json(response.data);

        })
        .catch(() => {

            if (books[isbn]) {

                return res.status(200).json(books[isbn]);

            }

            return res.status(404).json({
                message: "Book not found"
            });

        });

});




public_users.get("/author/:author", async (req, res) => {

    try {

        const author = req.params.author;

        const response = await axios.get(
            `http://localhost:5000/books/author/${author}`
        );

        return res.status(200).json(response.data);

    } catch (error) {

        const author = req.params.author.toLowerCase();

        const filteredBooks = Object.values(books).filter(book =>
            book.author.toLowerCase() === author
        );

        return res.status(200).json(filteredBooks);

    }

});



public_users.get("/title/:title", async (req, res) => {

    try {

        const title = req.params.title;

        const response = await axios.get(
            `http://localhost:5000/books/title/${title}`
        );

        return res.status(200).json(response.data);

    } catch (error) {

        const title = req.params.title.toLowerCase();

        const filteredBooks = Object.values(books).filter(book =>
            book.title.toLowerCase() === title
        );

        return res.status(200).json(filteredBooks);

    }

});



public_users.get("/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    if (books[isbn]) {

        return res.status(200).json(books[isbn].reviews);

    }

    return res.status(404).json({
        message: "Book not found"
    });

});


module.exports.general = public_users;
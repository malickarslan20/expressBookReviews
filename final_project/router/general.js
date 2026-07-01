const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* Register New User */
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Unable to register user."
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


/* Get All Books */
public_users.get("/", (req, res) => {

    return res.status(200).json(books);

});


/* Get Book by ISBN */
public_users.get("/isbn/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn]);

});


/* Get Books by Author */
public_users.get("/author/:author", (req, res) => {

    const author = req.params.author.toLowerCase();

    const filteredBooks = Object.values(books).filter(book =>
        book.author.toLowerCase() === author
    );

    return res.status(200).json(filteredBooks);

});


/* Get Books by Title */
public_users.get("/title/:title", (req, res) => {

    const title = req.params.title.toLowerCase();

    const filteredBooks = Object.values(books).filter(book =>
        book.title.toLowerCase() === title
    );

    return res.status(200).json(filteredBooks);

});


/* Get Book Reviews */
public_users.get("/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn].reviews);

});



async function getAllBooks() {

    const response = await axios.get("http://localhost:5000/");

    return response.data;

}


/* Get book by ISBN using Promise */
function getBookByISBN(isbn) {

    return axios
        .get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => response.data);

}


/* Get books by Author using Async/Await */
async function getBooksByAuthor(author) {

    const response = await axios.get(
        `http://localhost:5000/author/${author}`
    );

    return response.data;

}


/* Get books by Title using Async/Await */
async function getBooksByTitle(title) {

    const response = await axios.get(
        `http://localhost:5000/title/${title}`
    );

    return response.data;

}




module.exports = {
    general: public_users,
    getAllBooks,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle
};
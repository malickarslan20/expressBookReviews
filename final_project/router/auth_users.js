const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsame = users.filter(user => user.username === username);
    return userswithsame.length > 0;
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter(user =>
        user.username === username && user.password === password
    );
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign(
            {
                data: password
            },
            "access",
            { expiresIn: 60 * 60 }
        );

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).json({
            message: "User successfully logged in",
            accessToken
        });
    }

    return res.status(208).json({
        message: "Invalid Login. Check username and password."
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    const review = req.query.review;

    books[isbn].reviews[username] = review;

    return res.status(200).json(books[isbn]);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

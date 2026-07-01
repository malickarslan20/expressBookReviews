app.use("/customer/auth/*", function auth(req, res, next) {

    if (req.session.authorization) {

        let token = req.session.authorization.accessToken;

        jwt.verify(token, "access", (err, user) => {

            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({
                    message: "User not authenticated"
                });
            }

        });

    } else {

        return res.status(403).json({
            message: "User has not logged in"
        });

    }

});
const jwt = require("jsonwebtoken");

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "Please log in first!");
        res.redirect("/");
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect("/dashboard")
    },
    authenticateToken: function (req, res, next) {
        // Lấy token từ tiêu đề Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) {
            return res.status(401).json({
                "status": "error",
                "message": "Access token is missing",
                "errors": {
                    "details": "You must provide an access token"
                }
            });
        }

        // Xác minh token
        jwt.verify(token, "TrialTest", (err, member) => {
            if (err) {
                return res.status(403).json({
                    "status": "error",
                    "message": "Invalid token",
                    "errors": {
                        "details": "Token is not valid"
                    }
                });
            }

            // Thêm thông tin người dùng vào request object
            req.member = member;

            // Chuyển tiếp yêu cầu
            next();
        });
    }
}
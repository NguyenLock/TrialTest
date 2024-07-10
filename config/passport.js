const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");
const Members = require("../models/member");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
            //Match user
            Members.findOne({ username: username })
                .then((member) => {
                    if (!member) {
                        return done(null, false, { message: "This member is not registered" });
                    }
                    // Match password
                    bcrypt.compare(password, member.password, (err, isMatch) => {
                        if (err) return done(err);
                        if (isMatch) {
                            return done(null, member);
                        }
                        else {
                            return done(null, false, { message: "Password is incorrect" });
                        }
                    })
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, JSON.stringify(user));
    });

    // Deserialize user
    passport.deserializeUser((serializedUser, done) => {
        try {
            const user = JSON.parse(serializedUser);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}
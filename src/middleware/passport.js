const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { User } = require('../models')
const config = require('config');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.get('SECRET_KEY')


module.exports = (app) => {
    app.use(passport.initialize())

    passport.use(new JwtStrategy(opts, async (payload, done) => {
        try {
            console.log('payload', payload)
            let user = await User.findOne({ _id: payload._id });
            if (!user) {
                return done(null, false)
            } else {
                return done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))
}
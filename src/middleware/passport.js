const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('config');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.get('SECRET_KEY')


module.exports = (app) => {
    app.use(passport.initialize())

    passport.use(new JwtStrategy(opts, (payload, done) => {
        return done(null, payload)
    }))
}
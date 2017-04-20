const FacebookStrategy = require('passport-facebook').Strategy;
// const LocalStrategy = require('passport-local').Strategy;
// const TwitterStrategy = require('passport-twitter').Strategy;
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../../../db/models/users.js');

// load auth variables
const {FACEBOOK_AUTH} = require('../../../config/config.js'); // use this one for testing

module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id)
    .then((err, user) => {
      done(err, user);
    });
  });  

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  
  const fbStrategy = FACEBOOK_AUTH;
  fbStrategy.passReqToCallback = true; // allows us to pass in the req from our route (lets us check if user is logged in or not)

  passport.use(new FacebookStrategy(fbStrategy,
  function(req, token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(() => {
      // check if user is already logged in
      // if user is not already logged in
      if (!req.user) {

        // find user in database based on his/her facebook id
        User.findOne({where: {'facebookId': profile.id}})
        .then((err, user) => {
          // if there is an error, stop everything and return error
          // example: error connecting to database
          if (err) {
            return done(err);
          }

          // if user is found, then log in him/her
          if (user) {
            // if there is a user id already but no token (user was linked at one point and then removed)
            if (!user.facebookToken) {
              User.update({facebookId: user.facebookId}, {where: {
                  facebookToken: token,
                  facebookName: profile.name.givenName + ' ' + profile.name.familyName,
                  facebookEmail: (profile.emails[0].value || '').toLowerCase()
                }})
              .then((updatedUser) => {
                return done(null, updatedUser);
              })
              .catch((err) => console.log('Error updating Facebook user: ', err));
            }
            return done(null, user); // user found, return that user
          
          } else {
            // if there is no user found with that facebook id, create user
            User.create({
              facebookId: profile.id, // set user's facebook id   
              facebookToken: token, // we will save token that facebook provides to user
              facebookName: profile.name.givenName + ' ' + profile.name.familyName, // look at passport user profile to see how names are returned
              facebookEmail: profile.emails[0].value // facebook can return multiple emails so we'll take the first
            })
            .then((newUser) => {
              // if successful, return new user
              return done(null, newUser);
            })
            .catch((err) => console.log('Error creating new Facebook user: ', err));
          }
        });
        
      } else {
          // user already exists and is logged in, we have to link accounts
          const user = req.user; // pull user out of session

          User.update({id: user.id}, {where: {
            facebookId: profile.id, // set the users facebook id   
            facebookToken: token, // we will save the token that facebook provides to the user
            facebookName: profile.name.givenName + ' ' + profile.name.familyName, // look at the passport user profile to see how names are returned
            facebookEmail: profile.emails[0].value // facebook can return multiple emails so we'll take the first
          }})
          .then((linkedUser) => {
            // if successful, return the new user
            return done(null, linkedUser);
          })
          .catch((err) => console.log('Error linking Facebook user: ', err));
      }
    });
  }));
};

// https://scotch.io/tutorials/easy-node-authentication-facebook#configuring-passports-facebook-strategy-configpassportjs
// https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// https://github.com/scotch-io/easy-node-authentication
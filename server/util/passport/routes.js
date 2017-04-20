const request = require('request');

module.exports = function(app, passport) {

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

// facebook -------------------------------

    // send to facebook to do the authentication
    // app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }), function(req, res) {
    //    console.log('What is request?:', req);
       console.log('What is response session?:', res);
    });

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/'
        }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

// facebook -------------------------------

    // // send to facebook to do the authentication
    // app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // // handle the callback after facebook has authorized the user
    // app.get('/connect/facebook/callback',
    //     passport.authorize('facebook', {
    //         successRedirect: '/profile',
    //         failureRedirect: '/'
    //     }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user = req.user;
        User.update({id: user.id}, {where: {
            facebookToken: undefined, // we will save the token that facebook provides to the user
        }})
        .then((unlinkedUser) => {
            // if successful, return the new user
            return done(null, unlinkedUser);
        })
        .catch((err) => console.log('Error linking Facebook user: ', err));
    });

    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }
}
const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc Auth with google
// @route GET /auth/google

router.get('/google', passport.authenticate('google',{scope: ['profile','email']}));

// @desc Google auth callback
// @route GET /auth/google/callback

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/',}), (req,res) =>{
    res.redirect('/dashboard');
});

// @desc logout user
// @route /auth/logout

router.get('/logout', (req,res)=>{
    req.logout(); // logout method already present in passport middleware
    res.redirect('/');
});

module.exports = router;
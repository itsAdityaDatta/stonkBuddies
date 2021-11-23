const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth'); //authentication, ensure guests cant access dashboard and logged in users cant access login page 

const Group = require('../models/Group');
 
// @desc login-landing page
// @route GET /

router.get('/', ensureGuest, (req,res)=>{
    res.render("login.hbs",{
        layout: 'login'
    });
});

// @desc dashboard
// @route GET /dashboard 

router.get('/dashboard', ensureAuth, async (req,res)=>{
    try {
        const groups = await Group.find({user: {$elemMatch : {$eq : req.user._id} } })
        .populate('creator')
        .sort({createdAt: 'desc'})
        .lean();

        res.render("dashboard.hbs", {
            name: req.user.firstName,
            groups: groups,
            title: "Dashboard",
            layout: 'main.hbs'

        });
    } catch (error) {
        console.log(error);
        res.render('error/500');
        
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth'); //authentication, ensure guests cant access dashboard and logged in users cant access login page 

const Group = require('../models/Group');
const User = require('../models/User');


// @desc show group page
// @route GET /groups/:id

router.get('/:id', ensureAuth, async (req,res)=>{
    const user = await User.findOne({
        _id: req.params.id
    }).lean();

    if(!user){
        return res.render('error/404');
    }
    const groups = await Group.find({user: {$elemMatch : {$eq : req.params.id} } })
    .sort({createdAt: 'desc'})
    .lean();
   
    res.render('users/index.hbs',{
        user: user,
        groups:groups,
        title: user.displayName,
        layout: 'altMain.hbs'
    });
    
});

module.exports = router;
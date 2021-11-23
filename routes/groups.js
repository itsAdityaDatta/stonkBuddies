const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth'); //authentication, ensure guests cant access dashboard and logged in users cant access login page 

const Group = require('../models/Group');
const User = require('../models/User');
 
// @desc show add page
// @route GET /groups/add

router.get('/add', ensureAuth, (req,res)=>{
    res.render("groups/add.hbs", {
        title: "Add Group",
        layout: "altMain.hbs"
    });
});

// @desc process add form (post groups)
// @route POST /groups

router.post('/', ensureAuth, async (req,res)=>{
    try {
        // req.body provides with form data (bodyparser)
        // req.user provides info of user schema

        let memId1 = await User.find({email: req.body.mem1.toLowerCase()}).lean();
        let memId2 = await User.find({email: req.body.mem2.toLowerCase()}).lean();
        let memId3 = await User.find({email: req.body.mem3.toLowerCase()}).lean();
        
        req.body.user = [];
        req.body.user.push(req.user.id);
        
        if(memId1.length) req.body.user.push(memId1[0]._id);
        if(memId2.length) req.body.user.push(memId2[0]._id);
        if(memId3.length) req.body.user.push(memId3[0]._id);

        req.body.creator = req.user.id;
        await Group.create(req.body);
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
});



// @desc Update group name (route to process the edit form)
// @route PUT /stories/:id

router.put('/:id', ensureAuth, async (req,res)=>{
    let group = await Group.findById(req.params.id).lean();
    if(!group){
        return res.render('error/404');
    }
    if(group.creator != req.user.id){
        res.redirect('/groups',{
            title: "Groups"
        });
    } 
    else{
        group = await Group.findOneAndUpdate({_id:req.params.id}, {title:req.body.title, body:req.body.body});
        res.redirect('/dashboard');
    }
});


// @desc show all public groups
// @route GET /groups

router.get('/', ensureAuth, async (req,res)=>{
    try {
        const groups = await Group.find({status:'public'})
            .populate('creator')
            .sort({createdAt: 'desc'})
            .lean();

        res.render('groups/index.hbs',{
            groups: groups,
            title: "Groups",
            layout: "main.hbs"
        });
    } catch (error) {
        console.log(error);
        res.render('error/500');
    }
});

 
// @desc show edit page
// @route GET /groups/edit/:id

router.get('/edit/:id', ensureAuth, async (req,res)=>{
    const group = await Group.findOne({
        _id: req.params.id
    }).lean();

    if(!group){
        return res.render('error/404');
    }

    if(group.creator != req.user.id){
        res.redirect('/dashboard');
    } 
    else{
        res.render('groups/edit.hbs',{
            group: group,
            title: "Edit Group",
            layout: "altMain.hbs"
        });
    }
    
});


// @desc show group page
// @route GET /groups/:id

router.get('/:id', ensureAuth, async (req,res)=>{
    const group = await Group.findOne({
        _id: req.params.id
    }).lean();

    if(!group){
        return res.render('error/404');
    }
    // group users do not contain access karne wale ki id 
    let arr = group.user;
    let flag = false;
    for(let i=0;i<arr.length;i++){
        if(arr[i] == req.user.id){
            flag = true;
            break;
        }
    }
    const userArr = [];
    for(let i=0;i<arr.length;i++){
        const user = await User.findOne({
            _id: arr[i]
        }).lean();
        userArr.push(user);
    }

    if(!flag){
        res.redirect('/groups');
    } 
    else{
        res.render('groups/home.hbs',{
            group: group,
            user: userArr,
            title: group.title,
            layout: 'altMain.hbs'
        });
    }
    
});


// @desc add stock to database
// @route POST /groups/add/:id

router.post('/add/:id', ensureAuth, async (req,res)=>{
    let group = await Group.findById(req.params.id).lean();
    if(!group){
        return res.render('error/404');
    }
    else{
        let arr = group.stocks;
        arr.push(req.body.stock_name.toUpperCase());
        group = await Group.findOneAndUpdate({_id:req.params.id}, {stocks:arr});
        res.redirect('/groups/'+ req.params.id);
    }
});



module.exports = router;
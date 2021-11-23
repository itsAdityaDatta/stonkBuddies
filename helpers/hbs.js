
const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth'); //authentication, ensure guests cant access dashboard and logged in users cant access login page 

const Group = require('../models/Group');
const User = require('../models/User');

 // Formatting Date
const moment = require('moment');

module.exports = {
    formatDate: (date,format)=>{
        return moment(date).format(format);
    },
    truncate: (str,len) =>{
        if(str.length > len && str.length > 0){
            let new_str = str + ' ';
            new_str = str.substr(0,len);
            new_str = str.substr(0,new_str.lastIndexOf(' '));
            new_str = new_str.length > 0 ? new_str : str.substr(0,len);
            return new_str + '...';
        }
        return str;
    },
    stripTags: (input)=>{
        return input.replace(/<(?:.|\n)*?>/gm, ''); // replace anything withith < > brackets with nothing
    }

}

// we need to register these with handlebars --> app.js
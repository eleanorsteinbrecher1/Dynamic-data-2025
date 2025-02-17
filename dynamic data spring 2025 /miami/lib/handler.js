let eList = require('../data/emails.json')
// Import file system module
const fs = require('fs')

exports.newsletterSignup = (req,res) => {
    res.render('newsletter-signup', { csrf : 'supersecret'  })
 }

exports.newsletterSignupProcess = (req,res) => {
    console.log(req.body)
    //Extract the data
    // let user = {
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname,
    //     address: req.body.address,
    //     city: req.body.city,
    //     state: req.body.state,
    //     zip: req.body.zip,
    //     email: req.body.email
    // }
    //add the user to our list
    eList.users.push(req.body)
    console.log(eList)
    let json = JSON.stringify(eList)

    fs.writeFileSync('./data/emails.json',json,'utf-8',()=>{})


    res.redirect(303,'/newsletter/list')
    //res.render('newsletter-signup', { csrf : 'supersecret'  })
 }
 
 exports.newsletterSignupList = (req,res) => {
    console.log(eList)
    res.render('userspage',{"users":eList.users})
 }
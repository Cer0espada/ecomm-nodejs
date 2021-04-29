const express = require('express');

const {handleErrors} = require('./middlewares')
const usersRepo = require('../../repositories/Users')
const signupTemplate = require('../../Views/admin/auth/signup');
const signinTemplate = require('../../Views/admin/auth/signin');
const {requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser} = require('./validators')

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({req}))
});

router.post('/signup',
    [
        requireEmail,
        requirePassword,
        requirePasswordConfirmation
    ], 
    handleErrors(signupTemplate),
    async (req, res) => {

        const {email,password} = req.body;


        // Create a user in our user repo to represent this person
        const user = await usersRepo.create({email,password});

        req.session.userId = user.id
        // always use some outside library to manage cookies 

        // Store the id of that user inside the users cookie


        res.redirect('/admin/products')
    })

router.get('/signout', (req, res) => {
    req.session = null; 
    //clears session entirely to log the user out
    res.send('You are logged out')
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}))
})

router.post('/signin', [
    requireEmailExists,
    requireValidPasswordForUser
],
handleErrors(signupTemplate),
async (req, res) => {
    
    const {email} = req.body;

    const user = await usersRepo.getOneBy({email})

    req.session.userId = user.id; // what is making the user autheticated with the app

    res.redirect('/admin/products')
})

module.exports = router; 
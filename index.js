const express = require('express');
const BodyParser = require('Body-Parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products')
const productsRouter = require('./routes/products')
const cartsRouter = require('./routes/carts')

//const util = require('util');
// const crypto = require('crypto');

//const scrypt = util.promisify(crypto.scrypt)

const app = express(); 

app.use(express.static('public'))

// wired up middleware for parsing data 
app.use(BodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ['lkasld235j']
})
);
app.use(authRouter)
app.use(productsRouter)
app.use(adminProductsRouter);
app.use(cartsRouter)


app.listen(3000, ()=> {
    console.log('Listening');
})
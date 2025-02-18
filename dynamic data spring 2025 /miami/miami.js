// https://expressjs.com/
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
// Import routes handlers
const handler = require('./lib/handler')

//Setup the template engine handlebars
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

// To set the port execute: port=8080 node miami  
const port = process.env.port || 3000
// Store navigation data
let navigation = require("./data/navigation.json")
//Create some routes
app.get('/', (request,response)=>{
    response.type("text/html")
    response.render("home" , { title:"Miami Travel Site", nav: navigation  })
})

app.get('/beaches', (request,response)=>{
    response.type("text/html")
    response.render("page", {title :"Miami Beaches",nav:navigation})
})

app.get('/nightlife', (request,response)=>{
    response.type("text/html")
    response.render("page",{title:"Miami Night Life",nav:navigation})
})

app.get('/about', (request, response)=>{
    response.type("text/html")
    response.render("page",{title: "About Miami",nav:navigation})
})
// Query, params and body 
app.get('/search', (request, response)=>{
    console.log(request)
    response.type("text/html")
    response.render("page",{title: "Search results for: " + request.query.q,
        nav:navigation
    })
})
//Basic GET form
app.get('/basic',(req,res) => {
    res.render('page', {req})
})

//Newsletter Routes
app.get('/newsletter-signup', handler.newsletterSignup)
app.post('/newsletter-signup/process', handler.newsletterSignupProcess)
app.get('/newsletter/list',handler.newsletterSignupList)
//Dynamic Routes
//details shows one record 
app.get('/newsletter/detail/:email',handler.newsletterUser)
//delete users by email 
app.get('/newsletter/delete/:email',handler.newsletterUserDelete)

//error handling goes after the actual routes
//The default response is not found
app.use((request,response) => {
    response.type("text/html")
    response.status(404)
    response.send("404 not found")
})
//Server Error
app.use ( (error, request,response,next)=>{
    console.log(error)
    response.type("text/html")
    response.status(500)
    response.send("500 server error") 
})

//start the server
app.listen(port, ()=> {
    console.log(`Express is running on http://localhost:${port};`)
    console.log(` press Ctrl-C to terminate.`)
    })
    
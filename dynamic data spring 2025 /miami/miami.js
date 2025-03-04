// https://expressjs.com/
const express = require('express')
const app = express()
//Setup static routing
app.use(express.static('./public'))

/*
body-parser is a middleware for Node.js that processes the incoming request bodies before they reach the handlers. It is used to extract data from the request body and make it available in the req.body property. This is essential for handling data submitted through HTML forms and JSON data. 
*/
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
// Import Slideshow data
let slideshow = require('./data/slideshow.json')
// Import Gallery data
let gallery = require('./data/gallery.json')
// Import page data
let content = require('./data/pages.json')
// Import destination data
let destinations = require('./data/destinations.json')
//Create some routes
app.get('/', (request,response)=>{

    // Filter slideshow object to get home page only
    let slides = slideshow.slides.filter((slide)=>{
    return slide.home == true
    })

    response.type("text/html")
    response.render("page" , { 
        title:"Miami Travel Site", 
        nav: navigation, 
        slides: slides,
        images: gallery.images 
    })
})
//Dynamic routes for pages
app.get('/page/:page',(req,res) => {

     // Filter pages object to get page from :page req.params.page
     let page = content.pages.filter((item)=>{
        return item.page == req.params.page
        })
        //page is an array with just 1 item. we access the position 0 to get the object alone
        console.log(page[0]);

    // Filter slideshow object to get home page only
    let slides = slideshow.slides.filter((slide)=>{
        return slide.page == req.params.page
        })

        // Filter slideshow object to get home page only
        let dest = destinations.locations.filter((loc)=>{
            return loc.page == req.params.page
            })    

    res.type("text/html")
    res.render("page" , { 
        title:page[0].title,
        description:page[0].description, 
        locations: dest,
        nav: navigation, 
        slides: slides,
        images: gallery.images 
    })

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
    
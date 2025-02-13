const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const handler = require('./lib/handler');


const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

const port = process.env.port || 3000 
const navigation = require('./data/navigation.json'); 


app.get('/', (request, response) => {
    response.type("text/html");
    response.render("home", { title: "Miami Travel Site", navigation });
});


app.get('/beaches', (request, response) => {
    response.type("text/html");
    response.render("page", { title: "Miami Beaches" });
});

app.get('/nightlife', (request, response) => {
    response.type("text/html");
    response.render("page", { title: "Miami Night Life" });
});

app.get('/about', (request, response) => {
    response.type("text/html");
    response.render("page", { title: "About Miami" });
});

app.get('/search', (request, response) => {
    console.log(request);
    response.type("text/html");
    response.render("page", { title: "Search results for: " + request.query.q });
});

app.use((request, response) => {
    response.type("text/html");
    response.status(404);
    response.send("404 not found");
});

app.get('/basic',(req,res)=>{
    res.render('page',{req})
 })
 
 app.get('/newsletter-signup', handler.newsletterSignup)
 app.post('/newsletter-signup/process', handler.newsletterSignup)

app.use((error, request, response, next) => {
    console.error("Error:", error);
    response.type("text/html");
    response.status(500);
    response.send("500 server error");
});

app.listen(port, () => {
    console.log(`Express is running on http://localhost:${port}`);
    console.log("Press Ctrl-C to terminate.");
});

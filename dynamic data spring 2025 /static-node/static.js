//variables
const http = require('http');

const fs = require('fs')

const hostname = '127.0.0.1';
const port = 3000;
// Functions
// syntax of a function 
const someName = (name)=>{
    console.log("Your name is " + name)
}

someName("Elli S")
// Create a function to read files and display them
const displayPage = (path, r, status = 200)=> {
  r.setHeader('Content-Type', 'text/html')
  fs.readFile( path, (error,content)=>{
      //We need to handle errors first
      if(error) {
        r.statusCode = 500
        r.end("500 - error")
      } else {
      r.statusCode = status
      //if there are no errors, we can output the content
      r.end(content)
      }
  })
}


const server = http.createServer((req, res) => {

  console.log(req.url)
  
  switch (req.url) {
    case "":  
    case "/":
    //Respond to /
    displayPage('./public/home.html',res)
    break;
    
    case "/about":
    //Respond to /
    displayPage('./public/about.html',res)
    break;

    case "/contact":
    //Respond to /
    displayPage('./public/contact.html',res)
    break;

    default:
      //Respond to /
      displayPage('./public/404.html',res,404)

  }

 

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/ ...Press ctrl + c to close`);
});
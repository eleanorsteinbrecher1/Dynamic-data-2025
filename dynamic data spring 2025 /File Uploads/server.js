//initialize express
const express = require('express')

const app = express()

const multer = require('multer')

// Set body-parser
const bodyParser = require('body-parser');

// Define our models and init database
const { Sequelize, Model, DataTypes } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});
const ProfileImage = sequelize.define('ProfileImage', {
  url:DataTypes.STRING
})
//sync the models to the database 
sequelize.sync()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//initialize handlebars
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')

//set the server port
const port = process.env.port || 3000 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

//create routes 
app.get('/', (req,res)=>{
    res.type('text/html')
    res.render('page')
})

app.post('/profile', upload.single('avatar'), async (req, res) => {
    // req.file is the name of your file in the form above, here 'avatar'
    // req.body will hold the text fields, if there were any 
    console.log(req.file, req.body)
    console.log(req.file.originalname)
    console.log(req.file.mimetype)
    res.type('text/html')
    res.send('uploaded!!')
const img = await ProfileImage.create({
 url: req.file.filename
})
res.json(img)
     
  });
  
  app.get('/images', async (req, res) => {
    const images = await ProfileImage.findAll();
    res.json(images);
  });
  
//get Specific image 
app.get('/image/:id', async (req, res) => {
  const image = await ProfileImage.findByPk(req.params.id);
  res.json(image)
})

//Delete a Record 
app.get('/image/delete/:id', async (req, res) => {
  const image = await ProfileImage.findByPk(req.params.id);
  image.destroy()
  res.json(image)
})

//set up error handling 
//not found 
app.use((req,res)=>{
    res.type('text/html')
    res.status(404)
    res.send('not found')
})
//server errors 
app.use( (error,req,res,next)=>{
    res.type('text/html')
    res.status(500)
    res.send('server error')
})

app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}  ctrl + c to terminate`)
})
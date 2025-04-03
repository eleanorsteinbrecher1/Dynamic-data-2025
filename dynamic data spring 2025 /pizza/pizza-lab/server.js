const express = require('express')
const bodyParser = require('body-parser')
const { Sequelize, DataTypes } = require('sequelize')
const handlebars = require('express-handlebars')

const app = express()

// Set up handlebars with runtime options
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}))
app.set('view engine', 'handlebars')

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Sequelize setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'pizza.sqlite'
})

// Define Customer model
const Customer = sequelize.define('Customer', {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zip: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
})

sequelize.sync()

// ROUTES

// Show all customers
app.get('/', async (req, res) => {
  const customers = await Customer.findAll()
  res.render('page', { customers })
})

// Add customer
app.post('/add-customer', async (req, res) => {
  await Customer.create(req.body)
  res.redirect('/')
})

// View one customer
app.get('/customer/:id', async (req, res) => {
  const customer = await Customer.findByPk(req.params.id)
  if (!customer) return res.status(404).send('Customer not found')
  res.render('customerDetail', { customer })
})

// Delete customer
app.get('/customer/delete/:id', async (req, res) => {
  const customer = await Customer.findByPk(req.params.id)
  if (customer) await customer.destroy()
  res.redirect('/')
})

// 404
app.use((req, res) => {
  res.status(404).send('Page not found')
})

// Server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

const express = require('express')
const bodyParser = require('body-parser')
const { Sequelize, DataTypes } = require('sequelize')
const handlebars = require('express-handlebars')

const app = express()

// Set up handlebars with helpers
const hbs = handlebars.create({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  helpers: {
    eq: (a, b) => a == b
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'pizza.sqlite'
})

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

const Order = sequelize.define('Order', {
  size: DataTypes.STRING,
  toppings: DataTypes.STRING,
  notes: DataTypes.TEXT,
  status: DataTypes.STRING
})

Customer.hasMany(Order)
Order.belongsTo(Customer)

sequelize.sync()

// === CUSTOMER ROUTES ===

// List customers
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

// Edit customer form
app.get('/customer/edit/:id', async (req, res) => {
  const customer = await Customer.findByPk(req.params.id)
  if (!customer) return res.status(404).send('Customer not found')
  res.render('editCustomer', { customer })
})

// Handle customer edit
app.post('/customer/edit/:id', async (req, res) => {
  const customer = await Customer.findByPk(req.params.id)
  if (!customer) return res.status(404).send('Customer not found')
  await customer.update(req.body)
  res.redirect('/')
})

// Delete customer
app.get('/customer/delete/:id', async (req, res) => {
  const customer = await Customer.findByPk(req.params.id)
  if (customer) await customer.destroy()
  res.redirect('/')
})

// === ORDER ROUTES ===

// List orders
app.get('/orders', async (req, res) => {
  const orders = await Order.findAll({ include: Customer })
  const customers = await Customer.findAll()
  res.render('orders', { orders, customers })
})

// Add order
app.post('/add-order', async (req, res) => {
  await Order.create(req.body)
  res.redirect('/orders')
})

// View order
app.get('/order/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: Customer })
  if (!order) return res.status(404).send('Order not found')
  res.render('orderDetail', { order })
})

// Edit order form
app.get('/order/edit/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: Customer })
  const customers = await Customer.findAll()
  if (!order) return res.status(404).send('Order not found')
  res.render('editOrder', { order, customers })
})

// Handle order edit
app.post('/order/edit/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id)
  if (!order) return res.status(404).send('Order not found')
  await order.update(req.body)
  res.redirect('/orders')
})

// Delete order
app.get('/order/delete/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id)
  if (order) await order.destroy()
  res.redirect('/orders')
})

app.use((req, res) => {
  res.status(404).send('Page not found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

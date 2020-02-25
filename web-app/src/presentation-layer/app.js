const path = require('path')
const express = require('express')
const expressHandlebars = require('express-handlebars')
var bodyParser = require('body-parser')
const redis = require('redis')
const session = require('express-session')

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({host:'redis'})


const variousRouter = require('./routers/various-router')
const accountRouter = require('./routers/account-router')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))

// Setup express-handlebars.
app.set('views', path.join(__dirname, 'views'))

app.engine('hbs', expressHandlebars({
	extname: 'hbs',
	defaultLayout: 'main',
	layoutsDir: path.join(__dirname, 'layouts')
}))

app.use(
	session({
	  store: new RedisStore({ client: redisClient }),
	  secret: 'keyboard cat',
	  resave: false,
	  saveUninitialized : true
	})
  )



// Handle static files in the public folder.
app.use(express.static(path.join(__dirname, 'public')))

// Attach all routers.
app.use('/', variousRouter)
app.use('/accounts', accountRouter)

// Start listening for incoming HTTP requests!
app.listen(8080, function(){
	console.log('Running on 8080!')
})
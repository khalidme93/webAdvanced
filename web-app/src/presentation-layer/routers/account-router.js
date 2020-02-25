const express = require('express')
const accountManager = require('../../business-logic-layer/account-manager')
var bodyParser = require('body-parser')

const router = express.Router()
router.use(bodyParser.urlencoded({extended: false}))


router.get("/sign-in", function(request, response){
	response.render("sign-in.hbs")
})

router.get("/update-profile", function(request, response){
	const isLoggedIn = true
	response.render("update-profile.hbs", {isLoggedIn: isLoggedIn})
})

router.post("/update-profile",function(req,res){
	const username = req.body.name
	const email = req.body.email
	const account = req.session.account

	accountManager.updateAccountInformation(username,email,account,function(errors){
		if(errors.length > 0){
			res.render("update-profile.hbs", {error:errors})
		}	else	{
			req.session.account.email = email
			req.session.account.username = username
			model = {
				isLoggedIn : account ? true: false,
				user: {username: username, email: email}
			}
			res.render("profile.hbs", model)
		}
	})    
	
})

router.post("/sign-in", function(req, res){
	const username = req.body.username
	const password = req.body.password

	accountManager.signIn(username, password, function(errors, account){
		if(errors.length > 0){
			res.render("sign-in.hbs", {errors:errors})
		}else{
			req.session.account = account
			res.redirect("/accounts/profile")
		}	
	})
})

router.get("/sign-up", function(request, response){
	response.render("sign-up.hbs")
})

router.post("/sign-up",function(req,res)    {
	const username = req.body.username
	const email = req.body.email
	const password = req.body.password
	console.log("initiaed sign up")
	
	accountManager.createAccount(username,email,password,function(error){
		if(error.length > 0){
			res.render("sign-up.hbs",{errors:error})
		}   else
			res.redirect("/accounts/sign-in")
	})
})

router.get('/profile', function(req, res){

	const account = req.session.account
	if(!account){
		res.render("sign-in.hbs")
		return
	}	

    accountManager.getAccountByUsername(account.username,function(error,user){
		if(error){
			if(error.includes("database-error"))
				res.render("sign-in.hbs", {error})
			else
				res.render("sign-in.hbs", {error})
		}else{
			res.render("profile.hbs", {user})
		}
    })
})

router.post('/signout', function (request, response) {
	request.session.isLoggedIn = false
	response.redirect("/")
})

module.exports = router
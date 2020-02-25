const accountRepository = require('../data-access-layer/account-repository')
const bcrypt = require('bcryptjs')
const accountManager = require('../business-logic-layer/account-manager')



exports.createAccount = function(username,email,password,callback){
    let errors = []

    if(username.length < 6)
        errors.push("username needs to be atleast 6 letters")
    if(!email.includes("@"))
        errors.push("email needs to be valid")
    if(password.length < 8)
        errors.push("password needs to be atleast 8 letters")


    if(errors.length < 1){
        bcrypt.genSalt(10, function(err, salt) {
            if(err){
                errors.push("failed to generate salt !!")
                callback(err)
            }else{
                bcrypt.hash(password, salt, function(err, hashedPassword) {
                    if(err) {
                        errors.push("Failed to hash the password, please try again later!")
                        callback(errors)
                    }else{
                        accountRepository.createAccount(username, email, hashedPassword, function(error){
                            if(error){
                                if(error.sqlMessage)   {
                                    if(error.sqlMessage.includes("usernameUnique"))
                                        errors.push("Username not available, try a different username!")
                                    else if(error.sqlMessage.includes("emailUnique"))
                                        errors.push("Account with this email is already registered, try to reset the password!")
                                    else
                                        errors.push("Database error! Please try again later, " + error)
                                }else{
                                    errors.push(error)
                                }
                            }
                            callback(errors)
                        })
                    }
                })
            }
        })
    }else{
        callback(errors)
    }
}

exports.updateAccountInformation = function(username, email, account, callback){
    const errors = []
    accountId = account.id 
    
    if(!account){
        errors.push("you need to log in!")
        callback(errors)
        return
    }
    
    if(username == "")
        errors.push("Must enter a username.")
    if(username.length < 6)
        errors.push("username is to short!")
    if(email == ""){
        errors.push("Must enter a email.")
    if(!email.includes("@") || !email.includes("."))
        errors.push("enter a valid Email")

    if(errors.length > 0)   {
        callback(errors)
    }   else    {
        accountRepository.updateAccountInformation(accountId, username, email, function(error){
            if(error){
                errors.push(error)
                callback(errors)
            }   else
                callback(null)
        })
    }
}
}

exports.deleteUser = function(account, callback)   {
    var errors = []
    if(!account){
        errors.push("You need to login to delete an account!")
        callback(errors)
        return
    }

    accountRepository.deleteAccountById(account.id, function(error)    {
        if(error){
            errors.push({errCode:500,errMessage:"error deleting from user"})
        }
        callback(errors)
    })

}

exports.signIn = function(username,password,callback){
	const errors = []
    if(!username)
        errors.push("username missing")
    if(!password)
        errors.push("password missing")
     
    if(errors.length > 0)
        callback(errors, null)
    else    {
        accountRepository.signIn(username, function(error,account){
            if(error){
                errors.push("could not sign in")

            }else if(!account){
                errors.push("Wrong Username and/or password!")
                callback(errors, null)
            }else{
                bcrypt.compare(password, account.password, function(err, result) {
                    if(err) {
                        account = null
                        errors.push("Could not hash the password, please try again later!")
                    }
                    if(result != true)  {
                        account = null
                        errors.push("Please check that the username or password is correct!")
                    }
                    callback(errors, account)
                })
            }    
        })
    }
}

exports.getErrorAccountState = function(username, account, callback){
    let _state = { owner:false , isLoggedIn:false }

    if(!username && !account){
        callback([{errCode: 401, errMessage:"you're unAuthorized or no user wasn't clicked",key:"neither"}],null,null,null)
        return
    }else if(!username){
        username = account.username
        _state.owner = true
    }else if (account && username == account.username )
        _state.owner = true
    if(account)
        _state.isLoggedIn = true
        return 
}




exports.getAccountByUsername = function(username, callback){
	accountRepository.getAccountByUsername(username, function(error,account){
        if(!error && !account){
            callback("couldn't find account",null)
        }else if(error){
            callback("database-error", null)
        }else{
            callback(null,account)
        }

    })
}	



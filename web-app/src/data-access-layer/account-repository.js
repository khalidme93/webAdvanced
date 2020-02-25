const db = require('./db')


exports.getAllAccounts = function(callback){
	
	const query = `SELECT * FROM accounts ORDER BY username`
	const values = []
	
	db.query(query, values, function(error, accounts){
		if(error){
			callback(['databaseError'], null)
		}else{
			callback([], accounts)
		}
	})
	
}


exports.createAccount = function(username, email, password, callback){
	
	const query = "INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)"
	const values = [username, email, password]
	
	db.query(query, values, function(error)   {
        if(error){
			callback("Database error!");
        }else
            callback(null)
    })
}

exports.deleteAccountById = function(id, callback){
    const query = "DELETE FROM accounts WHERE id = ?"

    db.query(query, [id], function(error){
        if(error)
            callback("database error!")
        else
            callback(null)
    })
}

exports.updateAccountInformation = function(id, username, email, callback){
    const query = "UPDATE accounts SET email = ?, username = ? where id = ? "
    const values = [email, username, id]

    db.query(query, values, function(error){
        if(error)
            callback("database error")
        else
            callback(null)
    })
}

exports.signIn = function(username,callback){
	query = `SELECT * FROM accounts WHERE username = ?`
	const values = [username]

	db.query(query, values, function(error, account){
		console.log(account)
		if(error)
			callback("DatabaseError!")
		else if(account.length > 0){
			callback(null, account[0])
		}else{
			callback(null, null)
		}       
	})
}


exports.getAccountByUsername = function(username, callback){
	
	const query = `SELECT * FROM accounts WHERE username = ? LIMIT 1`
	const values = [username]
	
	db.query(query, values, function(error, accounts){
		callback(error, accounts[0])
	})
	
}

exports.getUsernameFromId = function(userId, callback)    {
	query = "SELECT username from accounts WHERE id = ?"

	db.query(query, userId, function(error, username)   {
		callback(error, username)
	})
}

exports.getUser = function(id,callback){
	query = "SELECT * FROM accounts WHERE id = ?"
	db.query(query,id,function(error,user){
		if(error){
			callback(error,null)
		}else{
			callback(null,user[0])
		}
	})
}


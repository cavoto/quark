let db = require('./lib/cloudant');

db.createDocument({a: 42}, function(err, data) {
	console.log(err)
	console.log(data)
})

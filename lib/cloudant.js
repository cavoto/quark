// Copyright © 2015, 2017 IBM Corp. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict';
require('dotenv').config()

var VCAP_SERVICES;

if (process.env.VCAP_SERVICES) {
	VCAP_SERVICES = process.env.VCAP_SERVICES;
} else {
	VCAP_SERVICES = {
		'cloudantNoSQLDB': [{
			'credentials': {
				'url': process.env.cloudantNoSQLDB_credentials_url
			}
		}]
	}
}
VCAP_SERVICES = (typeof VCAP_SERVICES === 'string') ? JSON.parse(VCAP_SERVICES) : VCAP_SERVICES;

if (!VCAP_SERVICES.cloudantNoSQLDB) {
	console.error("Please put the URL of your Cloudant instance in an environment variable 'CLOUDANT_URL'");
	process.exit(1);
}
console.log(VCAP_SERVICES.cloudantNoSQLDB[0].credentials.url)
// load the Cloudant library
var Cloudant = require('@cloudant/cloudant');
var cloudant = Cloudant({ url: VCAP_SERVICES.cloudantNoSQLDB[0].credentials.url });
var dbname = 'mydb';
var db = cloudant.db.use(dbname);;


// create a database
var createDatabase = function (callback) {
	console.log("Creating database '" + dbname + "'");
	cloudant.db.create(dbname, function (err, data) {
		console.log('Error:', err);
		console.log('Data:', data);
		db = cloudant.db.use(dbname);
		callback(err, data);
	});
};

// create a document
var createDocument = function (doc, callback) {
	console.log("Creating document 'mydoc'");
	db.insert(doc, function (err, data) {
		console.log('Error:', err);
		console.log('Data:', data);
		callback(err, data);
	});
};

// read a document
var readDocument = function (callback) {
	console.log("Reading document 'mydoc'");
	db.get('mydoc', function (err, data) {
		console.log('Error:', err);
		console.log('Data:', data);
		callback(err, data);
	});
};

// update a document
var updateDocument = function (doc, callback) {
	console.log("Updating document 'mydoc'");
	db.insert(doc, function (err, data) {
		console.log('Error:', err);
		console.log('Data:', data);
		callback(err, data);
	});
};

// deleting a document
var deleteDocument = function (doc, callback) {
	console.log("Deleting document 'mydoc'");
	// supply the id and revision to be deleted
	db.destroy(doc._id, doc._rev, function (err, data) {
		console.log('Error:', err);
		console.log('Data:', data);
		callback(err, data);
	});
};

// deleting the database document
var deleteDatabase = function (dbname, callback) {
	console.log("Deleting database '" + dbname + "'");
	cloudant.db.destroy(dbname, function (err, data) {
		console.log('Error:', err);
		console.log('Data:', data);
		callback(err, data);
	});
};

module.exports = {
	createDatabase, createDocument, readDocument, updateDocument, deleteDatabase, deleteDocument
};
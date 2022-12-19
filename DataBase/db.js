const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
var admin = require("firebase-admin");
require('dotenv').config()

var serviceAccount = JSON.parse(process.env.FIREBASE_DATA)



initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});



const db = getFirestore();

module.exports = db
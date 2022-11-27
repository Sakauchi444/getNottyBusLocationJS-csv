const fs = require('fs')
const stringify = require("csv-stringify/sync")

const moment = require('moment')
const currentTime = moment()
const date = currentTime.format("YYYY-MM-DD").toString()

const admin = require('firebase-admin')
require('dotenv').config()

const serviceAccount = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
})



// csv
// const parse = require("csv-parse/sync")


// get buslocation data from firebase
const db = admin.database()
const ref = db.ref("BusLocation")
ref.child("route_c").on("value", (snapshot) => {
    const data_array = JSON.parse(JSON.stringify(snapshot.toJSON()))
    // const data_array= snapshot.toJSON()
    console.log(data_array)

    const csvString = stringify.stringify([data_array])

    fs.open(`./data/${date}.csv`, 'a',(err, fd) => {
        if (err) throw err;
    
        fs.writeFile(fd, csvString, (err) => {
            if (err) throw err;
    
            console.log('追記されました');
    
            fs.close(fd, (err) => {
                if (err) throw err;
            });
        });
    });

    // fs.writeFileSync("./data/outputData.csv", csvString, {encoding: "utf8"})
})

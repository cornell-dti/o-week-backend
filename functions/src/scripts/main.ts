import * as admin from "firebase-admin";
import DB from "../db_const";
const serviceAccount = require("../../pk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://oweek-1496849141291.firebaseio.com'
});

const db = admin.firestore();

db.collection(DB.COLLECTION_RESOURCES)
    .add({name: "hi", link: "there"})
    .then(res => console.log(`Worked with res: ${JSON.stringify(res)}`))
    .catch(err => console.log(`Oops: ${err}`));
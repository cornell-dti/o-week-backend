import {Request, Response} from "firebase-functions";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Timestamp = admin.firestore.Timestamp;
const DB = require("./db_const");
const helpers = require("./helpers");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();


exports.helloWorld = helpers.getFunctions().https.onRequest(async (req: Request, res: Response) => {
    return res.send("hello world");
});

/**
 * Outputs an array of resources.
 * @example [{"name":"Cornell Design & Tech Initiative","link":"https://cornelldti.org"}]
 */
exports.getResources = helpers.getFunctions().https.onRequest(async (req: Request, res: Response) => {
    db.collection(DB.COLLECTION_RESOURCES).get()
        .then(resources => {
            const jsonResources = resources.docs.map(doc => doc.data());
            res.send(jsonResources);
        })
        .catch(err => res.send(`Error: ${err}`));
});

/**
 * Expects ?timestamp=12345678, where the number is the last updated Epoch time.
 */
exports.version = helpers.getFunctions().https.onRequest(async (req: Request, res: Response) => {
    const oldTimestamp = Timestamp.fromMillis(req.query.timestamp);
    const allEventsPromise = helpers.filterTimestamp(db.collection(DB.COLLECTION_EVENTS), oldTimestamp).get();
    const allCategoriesPromise = helpers.filterTimestamp(db.collection(DB.COLLECTION_EVENTS), oldTimestamp).get();

    Promise.all([allEventsPromise, allCategoriesPromise])
        .then((eventsAndCategories) => {
            const events = eventsAndCategories[0];
            const categories = eventsAndCategories[1];
        })
        .catch(err => res.send(`Error: ${err}`));
});
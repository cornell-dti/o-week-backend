import {Request, Response} from "firebase-functions";
import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import * as admin from "firebase-admin";
import DB from "./db_const";
import helpers from "./helpers";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

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
 * Return format specified in README;
 * {
 *     events: {
 *         changed: [events],
 *         deleted: [ids]
 *     },
 *     categories: {
 *         changed: [categories],
 *         deleted: [ids]
 *     },
 *     timestamp: 123456789
 * }
 */
exports.version = helpers.getFunctions().https.onRequest(async (req: Request, res: Response) => {
    //only retrieve models modified after the timestamp
    const oldTimestamp = firestore.Timestamp.fromMillis(req.query.timestamp);
    const allEventsPromise = helpers.filterTimestamp(db.collection(DB.COLLECTION_EVENTS), oldTimestamp).get();
    const allCategoriesPromise = helpers.filterTimestamp(db.collection(DB.COLLECTION_CATEGORIES), oldTimestamp).get();

    Promise.all([allEventsPromise, allCategoriesPromise])
        .then((eventsAndCategories) => {
            const allEvents = eventsAndCategories[0];
            const allCategories = eventsAndCategories[1];
            //separate into deleted and changed
            const events = helpers.splitChangedDeleted(allEvents);
            const categories = helpers.splitChangedDeleted(allCategories);

            const timestamp = firestore.Timestamp.now();

            res.send({events, categories, timestamp});
        })
        .catch(err => res.send(`Error: ${err}`));
});
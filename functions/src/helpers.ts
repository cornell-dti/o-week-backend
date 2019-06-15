import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
const DB = require("./db_const");

// function params
const REGION = "us-east1";
const TIMEOUT = 20;

/**
 * Get {@link functions} with customized parameters
 */
function getFunctions() {
    return functions.region(REGION).runWith({timeoutSeconds: TIMEOUT});
}

/**
 * Returns the collection of items with timestamp key larger than the provided time.
 * @param collection Database to filter
 * @param timeStamp Timestamp of last updated database
 */
function filterTimestamp(collection: firestore.CollectionReference, timeStamp: firestore.Timestamp) {
    return collection.where(DB.FIELD_TIMESTAMP, ">", timeStamp);
}

module.exports = {
    getFunctions,
    filterTimestamp
};
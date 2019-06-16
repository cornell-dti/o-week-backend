import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";
import DB from "./db_const";

// function params
const REGION = "us-east1";
const TIMEOUT = 20;

export default class helpers {
    /**
     * Get {@link functions} with customized parameters
     */
    static getFunctions(): functions.FunctionBuilder {
        return functions.region(REGION).runWith({timeoutSeconds: TIMEOUT});
    }

    /**
     * Returns the collection of items with timestamp key larger than the provided time.
     * @param collection Database to filter
     * @param timeStamp Timestamp of last updated database
     */
    static filterTimestamp(collection: firestore.CollectionReference, timeStamp: firestore.Timestamp): firestore.Query {
        return collection.where(DB.FIELD_TIMESTAMP, ">", timeStamp);
    }

    /**
     * Splits items into those that are deleted and those that aren't.
     * Returns {changed, deleted}, where changed are the JSON data and deleted are IDs.
     * @param models Events or categories
     */
    static splitChangedDeleted(models: firestore.QuerySnapshot) {
        const changed: firestore.DocumentData[] = [];
        const deleted: string[] = [];
        for (const model of models.docs) {
            if (model.data()[DB.FIELD_DELETED])
                deleted.push(model.id);
            else
                changed.push(model.data());
        }

        return {changed, deleted};
    }
}
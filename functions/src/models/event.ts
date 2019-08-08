import {firestore} from "firebase-admin";

interface Event {
    pk: string,
    name: string,
    description: string,
    url: string,
    additional: string,
    location: string,
    longitude: number,
    latitude: number,
    start: firestore.Timestamp,
    end: firestore.Timestamp,
    timestamp: number,
    required: boolean,
    categories: string[],
    categoryRequired: boolean
}

export {
    Event
}
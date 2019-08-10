import * as admin from "firebase-admin";
import DB from "../db_const";
import serviceAccount from "../../pk.json";
import familyEvents from "../../out.json";
import collegeEvents from "../../out_colleges.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://oweek-1496849141291.firebaseio.com'
});

const db = admin.firestore();

const batch = db.batch();
for (const event of collegeEvents)
    batch.set(db.collection(DB.COLLECTION_EVENTS).doc(event.pk), event);
for (const event of familyEvents.events)
    batch.set(db.collection(DB.COLLECTION_EVENTS).doc(event.pk), event);
for (const category of familyEvents.categories)
    batch.set(db.collection(DB.COLLECTION_CATEGORIES).doc(category.pk), category);
batch.commit().catch(err => console.log(`Error: ${err}`));
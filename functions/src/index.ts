import {Request, Response, https} from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

exports.helloWorld = https.onRequest(async (req:Request, res:Response) => {
    return res.send("hello world");
});
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
// const functions = require('firebase-functions');

import * as functions from 'firebase-functions';
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

// export const helloWorldTest = functions.https.onRequest((request: any, response: any) => {
//     response.set('Access-Control-Allow-Origin', '*');
//     response.send('Hello from Firebase!');
// });

exports.trickortreat = functions.https.onCall((data: any, context: any) => {
    return 'hello world trick';
});

// exports.assignUserPlan = functions.auth.user().onCreate(user => {
//     user.
// });

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp();
const USER_DOCUMENT_PATH = 'users';
// const PROJECT_DOCUMENT_PATH = 'projects' as const;
exports.updateUserMetadata = functions.https.onCall((data, context) => {
    isAuthenticated(context);
    admin
        .firestore()
        .collection(USER_DOCUMENT_PATH)
        .doc(context.auth.uid)
        .set({ firstName: data.firstName, lastName: data.lastName, plan: data.plan }, { merge: true })
        .then(success => {
        return {};
    }, err => {
        throw new functions.https.HttpsError('internal', 'An error occurred while updating user');
    });
});
function isAuthenticated(context) {
    var _a;
    const uid = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'User not authenticated.');
    }
}
//# sourceMappingURL=index.js.map
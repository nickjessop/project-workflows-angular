"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserMetadata = exports.invitationEmail = void 0;
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// firebase deploy --only functions
const sgMail = require("@sendgrid/mail");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp();
// const db = admin.firestore();
const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);
// Sends invitation email via HTTP
exports.invitationEmail = functions.https.onCall(async (data, context) => {
    isAuthenticated(context);
    const emails = [];
    data.emails.map((email) => {
        emails.push({ to: email });
    });
    const msg = {
        personalizations: emails,
        from: { email: 'noreply@stepflow.co', name: 'Stepflow' },
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject: data.subject,
            fromEmail: data.fromEmail,
            projectName: data.projectName,
            projectSender: data.projectSender,
            projectLink: data.projectLink,
            projectRole: data.projectRole,
        },
    };
    await sgMail.send(msg);
    // Handle errors here
    // Response must be JSON serializable
    return { success: true };
});
function isAuthenticated(context) {
    var _a;
    const uid = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'User not authenticated.');
    }
}
exports.updateUserMetadata = functions.https.onCall((data, context) => {
    isAuthenticated(context);
    admin
        .firestore()
        .collection('/users')
        .doc(context.auth.uid)
        .set({ firstName: data.firstName, lastName: data.lastName, plan: data.plan, email: data.email })
        .then(success => {
        return {};
    }, err => {
        throw new functions.https.HttpsError('internal', 'An error occurred while updating user');
    });
});
//# sourceMappingURL=index.js.map
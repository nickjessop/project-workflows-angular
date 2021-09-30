// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// firebase deploy --only functions
import * as sgMail from '@sendgrid/mail';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp();
// const db = admin.firestore();

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;

sgMail.setApiKey(API_KEY);

// Sends invitation email via HTTP
export const invitationEmail = functions.https.onCall(async (data, context) => {
    isAuthenticated(context);
    const emails: { to: string }[] = [];
    data.emails.map((email: string) => {
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

function isAuthenticated(context: functions.https.CallableContext) {
    var _a;
    const uid = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid;
    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'User not authenticated.');
    }
}

export const updateUserMetadata = functions.https.onCall(
    (
        data: {
            firstName?: string;
            lastName?: string;
            plan?: 'Plus' | 'Growth' | 'Essential' | 'Free';
            email?: string;
        },
        context
    ) => {
        isAuthenticated(context);

        admin
            .firestore()
            .collection('/users')
            .doc(context.auth!.uid)
            .set({ firstName: data.firstName, lastName: data.lastName, plan: data.plan, email: data.email })
            .then(
                success => {
                    return {};
                },
                err => {
                    throw new functions.https.HttpsError('internal', 'An error occurred while updating user');
                }
            );
    }
);

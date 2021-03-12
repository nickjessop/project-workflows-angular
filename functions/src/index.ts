// The Firebase Admin SDK to access Cloud Firestore.
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp();

const USER_DOCUMENT_PATH = 'users' as const;
// const PROJECT_DOCUMENT_PATH = 'projects' as const;

exports.updateUserMetadata = functions.https.onCall(
    (data: { firstName?: string; lastName?: string; plan?: 'Plus' | 'Growth' | 'Essential' | 'Free' }, context) => {
        isAuthenticated(context);

        admin
            .firestore()
            .collection(USER_DOCUMENT_PATH)
            .doc(context.auth!.uid)
            .set({ firstName: data.firstName, lastName: data.lastName, plan: data.plan }, { merge: true })
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

function isAuthenticated(context: functions.https.CallableContext) {
    const uid = context.auth?.uid;

    if (!uid) {
        throw new functions.https.HttpsError('unauthenticated', 'User not authenticated.');
    }
}

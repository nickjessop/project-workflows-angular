import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';
import * as admin from 'firebase-admin';
import { PROJECT_STORAGE_USAGE_COLLECTION, USER_COLLECTION_NAME } from '../../libs/interfaces/src';

import { firestore } from 'firebase-admin';

admin.initializeApp();
// const db = admin.firestore();

const API_KEY = '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';
const TEMPLATE_ID = 'd-5f34c6d8857d4c27867d0b58b64f02b1';

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
    async (
        data: {
            firstName?: string;
            lastName?: string;
            plan?: 'Plus' | 'Growth' | 'Essential' | 'Free';
            email?: string;
        },
        context
    ) => {
        isAuthenticated(context);

        const res = await _updateUserMetadata(context.auth!.uid, data.firstName, data.lastName, data.plan, data.email);

        if (!res) {
            throw new functions.https.HttpsError('internal', 'An error occurred while updating user');
        }

        return {};
    }
);

function _updateUserMetadata(
    uid: string,
    firstName?: string,
    lastName?: string,
    plan?: 'Plus' | 'Growth' | 'Essential' | 'Free',
    email?: string
) {
    return admin
        .firestore()
        .collection(USER_COLLECTION_NAME)
        .doc(uid)
        .set({ firstName, lastName, plan, email })
        .then(
            success => {
                return success;
            },
            err => {
                return undefined;
            }
        );
}

export const createUserAndAttachMetadata = functions.https.onCall(
    async (data: {
        firstName: string;
        lastName: string;
        password: string;
        plan: 'Plus' | 'Growth' | 'Essential' | 'Free';
        email: string;
    }) => {
        const { firstName, lastName, password, plan, email } = data;

        const user = await admin.auth().createUser({
            email,
            emailVerified: false,
            password,
            displayName: `${firstName} ${lastName}`,
        });

        if (!user) {
            throw new functions.https.HttpsError('internal', 'An error occurred while creating your user.');
        }

        const updatedUser = await _updateUserMetadata(user.uid, firstName, lastName, plan, email);

        if (!updatedUser) {
            await admin.auth().deleteUser(user.uid);

            throw new functions.https.HttpsError(
                'internal',
                'An error occurred while creating your user with your details.'
            );
        }

        return {};
    }
);

export const updateProjectStorageUsageOnDeletion = functions.storage.object().onDelete(async handler => {
    const filePath = handler.name?.split('/'); // File path in the bucket.
    const projectId = filePath?.[1];
    const fileSize = handler.size;

    if (!filePath || !projectId) {
        return;
    }
    try {
        const storageUsageObj = await admin
            .firestore()
            .collection(PROJECT_STORAGE_USAGE_COLLECTION)
            .where('projectId', '==', projectId)
            .get();

        if (!storageUsageObj.empty) {
            const usageRef = storageUsageObj.docs[0].ref;
            await usageRef.update({
                totalBytes: firestore.FieldValue.increment(Number(fileSize) * -1),
            });
        }

        return {};
    } catch (err) {
        return { err };
    }
});

export const updateProjectStorageUsageOnAddition = functions.storage.object().onFinalize(async handler => {
    const filePath = handler.name?.split('/'); // File path in the bucket.
    const projectId = filePath?.[1];
    const fileSize = handler.size;

    if (!filePath || !projectId) {
        return;
    }
    try {
        const storageUsageObj = await admin
            .firestore()
            .collection(PROJECT_STORAGE_USAGE_COLLECTION)
            .doc(projectId)
            .get();

        if (storageUsageObj.exists) {
            const usageRef = storageUsageObj.ref;

            await usageRef.update({
                totalBytes: firestore.FieldValue.increment(Number(fileSize)),
            });
        } else {
            await admin
                .firestore()
                .collection(PROJECT_STORAGE_USAGE_COLLECTION)
                .doc(projectId)
                .set({
                    projectId,
                    totalBytes: Number(fileSize),
                });
        }

        return {};
    } catch (err) {
        return { err };
    }
});

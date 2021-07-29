export interface User {
    id?: string;
    email?: string;
    emailVerified?: boolean;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    photoURL?: string;
    photoFilePath?: string;
    plan?: UserPlan;
}

export type UserPlan = 'Plus' | 'Growth' | 'Essential' | 'Free';

import { ValidatorFn } from '@angular/forms';
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

export interface Validator {
    name: string;
    validator: ValidatorFn;
    message: string;
}
export interface BlockConfig {
    label: string;
    name: string;
    metadata: ComponentMetadata;
    id?: string;
}

export type ComponentType =
    | 'checkboxes'
    | 'fileUploader'
    | 'imageUploader'
    | 'richTextInput'
    | 'table'
    | 'embed'
    | 'pdf'
    | 'draw';

export type ModeMap = {
    readonly [path in Role]: { allowedProjectModes: { [path in ProjectMode]: boolean } };
};

export const allowedModes: ModeMap = {
    owner: { allowedProjectModes: { configure: true, edit: true, view: true } },
    creator: { allowedProjectModes: { configure: true, edit: true, view: true } },
    editor: { allowedProjectModes: { configure: false, edit: true, view: true } },
    viewer: { allowedProjectModes: { configure: false, edit: false, view: true } },
};

export type ProjectMode = 'edit' | 'view' | 'configure';

export type ComponentMode = 'edit' | 'view';

export type ComponentMetadata = Checkboxes | FileUploader | ImageUploader | RichTextInput | Table | Embed | PDF | Draw;

export type BaseComponent = {
    component: ComponentType;
    validation?: Validator[];
    settings?: ComponentSettings;
};

export type ComponentSettings = {
    height?: number;
    textInputComponent?: {
        textareaHeight?: number;
    };
    imageUploaderComponent?: {
        maxThumbnails?: number;
    };
    tableComponent?: {
        disableTableHeaderStyle?: boolean;
        columnSizes?: number[];
    };
};

export interface Checkboxes extends BaseComponent {
    component: 'checkboxes';
    data: { value: { item: string; checked?: boolean }[] };
    colour: string;
    icon: string;
    description: string;
    label: string;
    beta: boolean;
}

export interface FileUploader extends BaseComponent {
    component: 'fileUploader';
    data: { value: Link[] };
    colour: string;
    icon: string;
    description: string;
    label: string;
    beta: boolean;
}

export interface ImageUploader extends BaseComponent {
    component: 'imageUploader';
    data: { value: Link[] };
    colour: string;
    icon: string;
    description: string;
    label: string;
    beta: boolean;
}

export interface RichTextInput extends BaseComponent {
    component: 'richTextInput';
    data: { value: string };
    colour: string;
    icon: string;
    description: string;
    label: string;
    beta: boolean;
}

export interface Draw extends BaseComponent {
    component: 'draw';
    data: { value: DrawHistory };
    colour: string;
    icon: string;
    description: string;
    label: string;
    beta: boolean;
}
export type DrawHistory = {
    x: number;
    y: number;
    lineWidth: number;
}[];

export interface Table extends BaseComponent {
    component: 'table';
    data: {
        value: TableColumn;
    };
    colour: string;
    icon: string;
    description: string;
    label: string;
    beta: boolean;
}
export interface TableColumn {
    row?: { item: { text: string; width?: string }[] }[];
}

export interface Embed extends BaseComponent {
    component: 'embed';
    data: { value: Link[] };
    colour: string;
    icon: string;
    description: string;
    label: string;
    beta: boolean;
}
export interface PDF extends BaseComponent {
    component: 'pdf';
    data: { value: Link };
    colour: string;
    icon: string;
    description: string;
    label: string;
    beta: boolean;
}

export type Link = {
    href?: string;
    title?: string;
    description?: string;
    filePath?: string;
    thumbnail?: string;
    size?: number;
    type?: string;
    extension?: string;
};
export interface IProjectInvitation {
    email: string;
    role: Role;
    project: string;
}

export interface Project {
    name: string;
    description?: string;
    configuration?: StepConfig[];
    shareLink?: ShareLink;
    members: string[];
    memberRoles: Array<{ userId: string; role: Role }>;
    pendingMembers?: string[];
    id?: string;
}

export interface ProjectUsers extends User {
    userId?: string;
    role?: Role;
}

export interface StepConfig {
    components?: BlockConfig[];
    step: Step;
}

export interface Step {
    title: string;
    icon?: string;
    description?: string;
    visibility?: 'show' | 'hide';
    interaction?: 'document' | 'form';
    isCurrentStep?: boolean;
    status: Status;
}

// owner: creator of the project
// creator: can configure project details, steps, and blocks
// editor: can edit the content within blocks, can comment
// viewer: read-only access to entire project, can not comment
// (future) commenter: read-only + ability to leave comments
export type Role = 'owner' | 'creator' | 'editor' | 'viewer';
export const SharePermissions = ['view', 'edit'] as const;
export type SharePermissions = ['view', 'edit'];
export type SharePermission = typeof SharePermissions[number];

export type Status = typeof NoStatus | typeof InProgress | typeof NeedsReview | typeof Upcoming | typeof Complete;

export const NoStatus = { label: 'No status', value: 'no-status', icon: '' } as const;
export const InProgress = { label: 'In progress', value: 'in-progress', icon: 'pi-step-inprogress' } as const;
export const NeedsReview = { label: 'Needs review', value: 'needs-review', icon: 'pi-step-important' } as const;
export const Upcoming = { label: 'Upcoming', value: 'upcoming', icon: 'pi-step-upcoming' } as const;
export const Complete = { label: 'Completed', value: 'completed', icon: 'pi-step-completed' } as const;

export interface ShareLink {
    userId: string;
    projectId: string;
    permission: SharePermission;
}

/**
 * Comment Types
 */

export interface Comment {
    commentId?: string;
    createdAt?: number;
    updatedAt?: number;
    parentCommentId?: string;
    authorId?: string;
    blockId?: string;
    body: string;
    deleted?: boolean;
    resolved?: boolean;
}

export interface CommentDetail {
    comment: Comment;
    isEditable: boolean;
    isDeletable: boolean;
    authorDisplayName: string;
    authorProfileImage: string | void;
}

export type CommentCounts = {
    all: number;
    resolved: number;
    unresolved: number;
};

export const USER_COLLECTION_NAME = 'users';
export const PROJECTS_COLLECTION = 'projects';
export const INVITATION_COLLECTION = 'invitations';
export const COMMENTS_COLLECTION = 'comments';
export const SHARE_COLLECTION = 'shareLinks';
export const PROJECT_STORAGE_USAGE_COLLECTION = 'projectStorageUsage';

export const allowedUserIds = [
    '06T4lgj7x1emjUEMCmPnJYPFjum2',
    'iIeZlcLjmebZSoEMuquh4F2htN92',
    'LkkX7f9yheRFHNwZkoCHhMb6AmC2',
    'S09Ert0pOpRKdb7pnc4rXFfyeWe2',
    'o24opqInUhbxnC9MFywy3YLLBE03',
    '0ZLQk9ekq3RJXMc2RMpCE8NEkJ73',
    'tpXpbNAPKpX1evoxSeRJs0O0pB02',
    'IoTwZeoPiSemew2z5IBbQcHPaNi2',
    'DxOw25Q8XigIlZMfnfN7vaCaVPo1',
    '3OqrvQESBPafZ7nF5U6v0QyM2B02',
    'nXGebyRkhLUckUcwJzGvsygjDCy1',
    'iGkMxx23DAVxVHkvMBM6oN9TjIJ3',
];

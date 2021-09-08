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
}

export type ComponentType =
    | 'checkboxes'
    | 'fileUploader'
    | 'imageUploader'
    | 'richTextInput'
    | 'textInput'
    | 'table'
    | 'embed';

export type ComponentMode = 'edit' | 'view' | 'configure';

export type ComponentMetadata = Checkboxes | FileUploader | ImageUploader | RichTextInput | TextInput | Table | Embed;

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
    };
};

export interface Checkboxes extends BaseComponent {
    component: 'checkboxes';
    data: { value: { item: string; checked?: boolean }[] };
}

export interface FileUploader extends BaseComponent {
    component: 'fileUploader';
    data: { value: Link[] };
}

export interface ImageUploader extends BaseComponent {
    component: 'imageUploader';
    data: { value: Link[] };
}

export interface RichTextInput extends BaseComponent {
    component: 'richTextInput';
    data: { value: string };
}

export interface TextInput extends BaseComponent {
    component: 'textInput';
    data: { value: string };
}

export interface Table extends BaseComponent {
    component: 'table';
    data: { value: { row?: { item: { text: string; isHeader?: boolean }[] }[] } };
}

export interface Embed extends BaseComponent {
    component: 'embed';
    data: { value: Link[] };
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
    description: string;
    configuration?: StepConfig[];
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
    description: string;
    visibility?: 'show' | 'hide';
    interaction?: 'document' | 'form';
    isCurrentStep?: boolean;
    status: Status;
}

// owner: creator of the project
// creator: can configure project details, steps, and blocks
// editor: can edit the content within blocks
// viewer: read-only access to entire project
// (future) commenter: read-only + ability to leave comments
export type Role = 'owner' | 'creator' | 'editor' | 'viewer';

export type Status = typeof NoStatus | typeof InProgress | typeof NeedsReview | typeof Upcoming | typeof Complete;

export const NoStatus = { label: 'No status', value: 'no-status', icon: '' } as const;
export const InProgress = { label: 'In progress', value: 'in-progress', icon: 'pi-progress' } as const;
export const NeedsReview = { label: 'Needs review', value: 'needs-review', icon: 'pi-exclamation' } as const;
export const Upcoming = { label: 'Upcoming', value: 'upcoming', icon: 'pi-clock-hands' } as const;
export const Complete = { label: 'Completed', value: 'completed', icon: 'pi-check' } as const;

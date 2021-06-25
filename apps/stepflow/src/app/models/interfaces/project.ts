import { BlockConfig } from '../../core/interfaces/core-component';
import { User } from '../../services/authentication/authentication.service';

export interface Project {
    name: string;
    description: string;
    configuration?: StepConfig[];
    members: string[];
    memberRoles: Array<{ userId: string; role: Role }>;
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
export const NeedsReview = { label: 'Needs review', value: 'needs-review', icon: 'pi-exclamation-circle' } as const;
export const Upcoming = { label: 'Upcoming', value: 'upcoming', icon: 'pi-clock' } as const;
export const Complete = { label: 'Completed', value: 'completed', icon: 'pi-check-circle' } as const;

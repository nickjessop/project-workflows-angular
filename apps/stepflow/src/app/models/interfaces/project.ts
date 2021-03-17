import { BlockConfig } from '../../core/interfaces/core-component';

export interface Project {
    name: string;
    description: string;
    configuration?: StepConfig[];
    members: string[];
    memberRoles: Array<{ userId: string; role: Role }>;
    id?: string;
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
export type Role = 'owner' | 'admin' | 'editor' | 'viewer' | 'guest';

export type Status = typeof NoStatus | typeof InProgress | typeof NeedsReview | typeof Upcoming | typeof Complete;

export const NoStatus = { label: 'No status', value: 'no-status', icon: '' } as const;
export const InProgress = { label: 'In progress', value: 'in-progress', icon: 'pi-progress' } as const;
export const NeedsReview = { label: 'Needs review', value: 'needs-review', icon: 'pi-exclamation-circle' } as const;
export const Upcoming = { label: 'Upcoming', value: 'upcoming', icon: 'pi-clock' } as const;
export const Complete = { label: 'Completed', value: 'completed', icon: 'pi-check-circle' } as const;

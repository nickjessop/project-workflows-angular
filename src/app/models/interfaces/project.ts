import { BlockConfig } from '../../core/interfaces/core-component';

export interface Project {
    name: string;
    ownerIds: string[];
    description: string;
    configuration?: StepConfig[];
    members?: Array<{ userId: string; role: Role }>;
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
    status?: Status;
}
export type Role = 'owner' | 'admin' | 'editor' | 'viewer' | 'guest';

export type Status = typeof InProgress | typeof Important | typeof Upcoming | typeof Complete;

export const InProgress = { label: 'In progress', value: 'in-progress', icon: 'pi-progress' } as const;
export const Important = { label: 'Important', value: 'important', icon: 'pi-exclamation-circle' } as const;
export const Upcoming = { label: 'Upcoming', value: 'upcoming', icon: 'pi-clock' } as const;
export const Complete = { label: 'Completed', value: 'completed', icon: 'pi-check-circle' } as const;

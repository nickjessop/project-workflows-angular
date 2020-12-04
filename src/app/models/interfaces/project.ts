import { FieldConfig } from '../interfaces/core-component';

export interface Project {
    name: string;
    ownerIds: string[];
    description: string;
    configuration?: StepConfig[];
    members?: Array<{ userId: string; role: Role }>;
    id?: string;
}

export interface StepConfig {
    components?: FieldConfig[];
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
export type Role = 'admin' | 'editor' | 'viewer' | 'guest';

export type Status = typeof Active | typeof Important | typeof Upcoming | typeof Complete;

export const Active = { label: 'Active', value: 'active', icon: 'pi-circle-off' } as const;
export const Important = { label: 'Important', value: 'important', icon: 'pi-exclamation-circle' } as const;
export const Upcoming = { label: 'Upcoming', value: 'upcoming', icon: 'pi-clock' } as const;
export const Complete = { label: 'Completed', value: 'completed', icon: 'pi-check-circle' } as const;

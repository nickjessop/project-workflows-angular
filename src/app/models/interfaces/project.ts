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

export type Status = {
    [name: string]: { label: string; icon: string };
};

export const statusOptions: Status = {
    active: { label: 'Active', icon: 'pi-circle-off' },
    important: { label: 'Important', icon: 'pi-exclamation-circle' },
    upcoming: { label: 'Upcoming', icon: 'pi-clock' },
    completed: { label: 'Completed', icon: 'pi-check-circle' },
};

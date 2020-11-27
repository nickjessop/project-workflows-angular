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
    status: { label: string; icon: string };
}

export type Role = 'admin' | 'editor' | 'viewer' | 'guest';

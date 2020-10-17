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
    title?: string;
    icon?: string;
    isCurrentStep?: boolean;
}

export type Role = 'admin' | 'editor' | 'viewer' | 'guest';

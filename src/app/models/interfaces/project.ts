import { FieldConfig } from '../interfaces/core-component';

export interface Project {
    name: string;
    ownerIds: string[];
    description: string;
    configuration?: ProjectConfig[];
    members?: Array<{ userId: string; role: Role }>;
    id?: string;
}

export interface ProjectConfig {
    components: FieldConfig[];
    step: Step;
}

export interface Step {
    title?: string;
    icon?: string;
    selected?: boolean;
}

export type Role = 'admin' | 'editor' | 'viewer' | 'guest';

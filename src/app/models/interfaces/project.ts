import { FieldConfig } from '../interfaces/core-component';

export interface Project {
    name: string;
    ownerIds: string[];
    configuration?: FieldConfig[];
    members?: Array<{ userId: string; role: Role }>;
    id?: string;
}

export type Role = 'admin' | 'editor' | 'viewer' | 'guest';

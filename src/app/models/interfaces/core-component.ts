import { ValidatorFn } from '@angular/forms';

export interface Validator {
    name: string;
    validator: ValidatorFn;
    message: string;
}

export interface FieldConfig {
    label?: string;
    name: string;
    inputType?: string;
    options?: string[];
    collections?: any;
    type: ComponentType;
    value?: any;
    validations?: Validator[];
}

export function createFieldConfig(
    label?: string,
    name?: string,
    inputType?: string,
    options?: string[],
    collections?: string,
    type?: ComponentType,
    value?: string
) {
    const fieldConfig = {
        label: label || '',
        name: name || '',
        inputType: inputType || '',
        options: options || [''],
        collections: collections || '',
        type: type || ('empty' as ComponentType),
        value: value || '',
    };

    return fieldConfig;
}

export type ComponentType =
    | 'checkboxes'
    | 'fileUploader'
    | 'imageUploader'
    | 'largeTextInput'
    | 'smallTextInput'
    | 'table'
    | 'url'
    | 'empty';

export type ComponentMode = 'edit' | 'view' | 'interact';

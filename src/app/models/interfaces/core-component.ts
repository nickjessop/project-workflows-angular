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
    | 'checkbox'
    | 'dropdown'
    | 'fileUploader'
    | 'imageUploader'
    | 'largeTextInput'
    | 'linearScale'
    | 'multipleChoice'
    | 'radioButton'
    | 'smallTextInput'
    | 'table'
    | 'empty';

export type ButtonType = 'button--primary' | 'button--secondary' | 'button--button' | 'button--round';

export type ComponentMode = 'edit' | 'view' | 'interact';

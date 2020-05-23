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

export function createFieldConfigDefault(): FieldConfig {
    const fieldConfig: FieldConfig = {
        label: '',
        name: '',
        inputType: '',
        options: [''],
        collections: '',
        type: 'empty',
        value: '',
        validations: [],
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

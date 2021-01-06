import { ValidatorFn } from '@angular/forms';

export interface Validator {
    name: string;
    validator: ValidatorFn;
    message: string;
}

export interface BlockConfig {
    label?: string;
    name: string;
    metadata: ComponentMetadata;
}

export function createBlockConfig(type: ComponentType, label?: string, name?: string) {
    const block: BlockConfig = {
        label: label || '',
        name: name || '',
        metadata: createComponentMetadataTemplate(type),
    };

    return block;
}

export function createComponentMetadataTemplate(componentType: ComponentType, validation?: Validator[]) {
    if (componentType === 'checkboxes') {
        const _component: Checkboxes = {
            component: 'checkboxes',
            data: { value: [{ item: '', checked: false }] },
        };

        if (validation) {
            _component.validation = validation;
        }

        return _component;
    } else if (componentType === 'fileUploader') {
        const _component: FileUploader = {
            data: {
                value: [
                    {
                        href: 'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria1.jpg',
                        description: 'Some description',
                        title: 'Some title',
                        thumbnail:
                            'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria1s.jpg',
                    },
                ],
            },
            component: 'fileUploader',
        };

        if (validation) {
            _component.validation = validation;
        }
        return _component;
    } else if (componentType === 'imageUploader') {
        const _component: ImageUploader = {
            data: {
                value: [
                    {
                        href: 'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria1.jpg',
                        description: '',
                        title: '',
                        thumbnail:
                            'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria1s.jpg',
                    },
                ],
            },
            component: 'imageUploader',
        };
        if (validation) {
            _component.validation = validation;
        }
        return _component;
    } else if (componentType === 'largeTextInput') {
        const _component: LargeTextInput = {
            data: { value: '' },
            component: 'largeTextInput',
        };

        if (validation) {
            _component.validation = validation;
        }
        return _component;
    } else if (componentType === 'smallTextInput') {
        const _component: SmallTextInput = {
            data: { value: '' },
            component: 'smallTextInput',
        };

        if (validation) {
            _component.validation = validation;
        }
        return _component;
    } else if (componentType === 'table') {
        //data: { value: { col:{ item :{text: string; isHeader?: boolean }[]}[] } };
        const _component: Table = {
            data: {
                value: {
                    row: [
                        {
                            item: [
                                { text: 'header1', isHeader: true },
                                { text: 'header2', isHeader: true },
                            ],
                        },
                        {
                            item: [
                                { text: 'item1', isHeader: false },
                                { text: 'item2', isHeader: false },
                            ],
                        },
                        {
                            item: [
                                { text: 'item3', isHeader: false },
                                { text: 'item4', isHeader: false },
                            ],
                        },
                        {
                            item: [
                                { text: 'item5', isHeader: false },
                                { text: 'item6', isHeader: false },
                            ],
                        },
                    ],
                },
            },
            component: 'table',
        };

        if (validation) {
            _component.validation = validation;
        }
        return _component;
    } else if (componentType === 'url') {
        const _component: Url = {
            data: { value: [{ href: '', description: '', title: '' }] },
            component: 'url',
        };

        if (validation) {
            _component.validation = validation;
        }
        return _component;
    } else {
        const _component: SmallTextInput = {
            data: { value: '' },
            component: 'smallTextInput',
        };

        if (validation) {
            _component.validation = validation;
        }
        return _component;
    }
}

export type ComponentType =
    | 'checkboxes'
    | 'fileUploader'
    | 'imageUploader'
    | 'largeTextInput'
    | 'smallTextInput'
    | 'table'
    | 'url';

export type ComponentMode = 'edit' | 'view' | 'interact';

export type ComponentMetadata =
    | Checkboxes
    | FileUploader
    | ImageUploader
    | LargeTextInput
    | SmallTextInput
    | Table
    | Url;

export type BaseComponent = {
    component: ComponentType;
    validation?: Validator[];
};

export interface Checkboxes extends BaseComponent {
    component: 'checkboxes';
    data: { value: { item: string; checked?: boolean }[] };
    validation?: Validator[];
}

export interface FileUploader extends BaseComponent {
    component: 'fileUploader';
    data: { value: Link[] };
    validation?: Validator[];
}

export interface ImageUploader extends BaseComponent {
    component: 'imageUploader';
    data: { value: Link[] };
    validation?: Validator[];
}

export interface LargeTextInput extends BaseComponent {
    component: 'largeTextInput';
    data: { value: string };
    validation?: Validator[];
}

export interface SmallTextInput extends BaseComponent {
    component: 'smallTextInput';
    data: { value: string };
    validation?: Validator[];
}

export interface Table extends BaseComponent {
    component: 'table';
    data: { value: { row?: { item: { text: string; isHeader?: boolean }[] }[] } };
    validation?: Validator[];
}

export interface Url extends BaseComponent {
    component: 'url';
    data: { value: Link[] };
    validation?: Validator[];
}

export type Link = {
    href?: string;
    title?: string;
    description?: string;
    thumbnail?: string;
    size?: number;
    type?: string;
};

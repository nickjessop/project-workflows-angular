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
    } else if (componentType === 'richTextInput') {
        const _component: RichTextInput = {
            data: { value: '' },
            component: 'richTextInput',
        };

        if (validation) {
            _component.validation = validation;
        }
        return _component;
    } else if (componentType === 'textInput') {
        const _component: TextInput = {
            data: { value: '' },
            component: 'textInput',
            settings: { TextInputComponent: { textareaHeight: 50 } },
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
    } else if (componentType === 'embed') {
        const _component: Embed = {
            data: { value: [{ href: '' }] },
            component: 'embed',
            settings: { embedComponent: { iframeHeight: 400 } },
        };

        if (validation) {
            _component.validation = validation;
        }
        return _component;
    } else {
        const _component: TextInput = {
            data: { value: '' },
            component: 'textInput',
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
    | 'richTextInput'
    | 'textInput'
    | 'table'
    | 'embed';

export type ComponentMode = 'edit' | 'view' | 'interact';

export type ComponentMetadata = Checkboxes | FileUploader | ImageUploader | RichTextInput | TextInput | Table | Embed;

export type BaseComponent = {
    component: ComponentType;
    validation?: Validator[];
    settings?: ComponentSettings;
};

export type ComponentSettings = {
    height?: number;
    TextInputComponent?: {
        textareaHeight?: number;
    };
    embedComponent?: {
        iframeHeight?: number;
    };
    imageUploaderComponent?: {
        maxThumbnails?: number;
    };
    tableComponent?: {
        disableTableHeaderStyle?: boolean;
    };
};

export interface Checkboxes extends BaseComponent {
    component: 'checkboxes';
    data: { value: { item: string; checked?: boolean }[] };
}

export interface FileUploader extends BaseComponent {
    component: 'fileUploader';
    data: { value: Link[] };
}

export interface ImageUploader extends BaseComponent {
    component: 'imageUploader';
    data: { value: Link[] };
}

export interface RichTextInput extends BaseComponent {
    component: 'richTextInput';
    data: { value: string };
}

export interface TextInput extends BaseComponent {
    component: 'textInput';
    data: { value: string };
}

export interface Table extends BaseComponent {
    component: 'table';
    data: { value: { row?: { item: { text: string; isHeader?: boolean }[] }[] } };
}

export interface Embed extends BaseComponent {
    component: 'embed';
    data: { value: Link[] };
}

export type Link = {
    href?: string;
    title?: string;
    description?: string;
    filePath?: string;
    thumbnail?: string;
    size?: number;
    type?: string;
};

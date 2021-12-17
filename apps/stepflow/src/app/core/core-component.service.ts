import { Injectable } from '@angular/core';
import {
    BlockConfig,
    Checkboxes,
    ComponentType,
    Embed,
    FileUploader,
    ImageUploader,
    RichTextInput,
    Table,
    TextInput,
    Validator,
} from '@stepflow/interfaces';

@Injectable({
    providedIn: 'root',
})
export class CoreComponentService {
    constructor() {}

    public createBlockConfig(type: ComponentType, label?: string, name?: string) {
        const block: BlockConfig = {
            label: label || '',
            name: name || '',
            metadata: this.createComponentMetadataTemplate(type),
        };

        return block;
    }

    public createComponentMetadataTemplate(componentType: ComponentType, validation?: Validator[]) {
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
                            href: '',
                            description: '',
                            title: '',
                            thumbnail: '',
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
                            href: '',
                            description: '',
                            title: '',
                            thumbnail: '',
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
                settings: { textInputComponent: { textareaHeight: 50 } },
            };

            if (validation) {
                _component.validation = validation;
            }
            return _component;
        } else if (componentType === 'table') {
            // row?: { column: { size?: number; text: string }[] }[];
            const _component: Table = {
                data: {
                    value: {
                        column: [
                            {
                                row: [{ text: 'Heading 1' }, { text: 'Heading 2' }, { text: 'Heading 3' }],
                            },
                            {
                                row: [{ text: '' }, { text: '' }, { text: '' }],
                            },
                            {
                                row: [{ text: '' }, { text: '' }, { text: '' }],
                            },
                            {
                                row: [{ text: '' }, { text: '' }, { text: '' }],
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
}

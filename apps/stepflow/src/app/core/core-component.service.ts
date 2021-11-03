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
                            href:
                                'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria1.jpg',
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
                            href:
                                'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria1.jpg',
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
                settings: { textInputComponent: { textareaHeight: 50 } },
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
                                    { text: 'New table', isHeader: true },
                                    { text: '', isHeader: true },
                                ],
                            },
                            {
                                item: [
                                    { text: '', isHeader: false },
                                    { text: '', isHeader: false },
                                ],
                            },
                            {
                                item: [
                                    { text: '', isHeader: false },
                                    { text: '', isHeader: false },
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

import { Injectable } from '@angular/core';
import {
    BlockConfig,
    Checkboxes,
    ComponentType,
    Draw,
    Embed,
    FileUploader,
    ImageUploader,
    PDF,
    RichTextInput,
    Table,
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
        } else if (componentType === 'table') {
            // row?: { column: { size?: number; text: string }[] }[];
            const _component: Table = {
                data: {
                    value: {
                        row: [
                            {
                                item: [{ text: 'Heading 1' }, { text: 'Heading 2' }, { text: 'Heading 3' }],
                            },
                            {
                                item: [{ text: 'item1' }, { text: 'item2' }, { text: 'item3' }],
                            },
                            {
                                item: [{ text: 'item4' }, { text: 'item5' }, { text: 'item6' }],
                            },
                            {
                                item: [{ text: 'item7' }, { text: 'item8' }, { text: 'item9' }],
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
        } else if (componentType === 'pdf') {
            const _component: PDF = {
                data: { value: { href: '' } },
                component: 'pdf',
            };

            if (validation) {
                _component.validation = validation;
            }
            return _component;
        } else {
            const _component: Draw = {
                data: { value: [{ x: 0, y: 0, lineWidth: 0 }] },
                component: 'draw',
            };

            if (validation) {
                _component.validation = validation;
            }
            return _component;
        }
    }
}

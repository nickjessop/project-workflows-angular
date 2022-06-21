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

import { v4 as uuid } from 'uuid';

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
            id: uuid(),
        };

        return block;
    }

    public createComponentMetadataTemplate(componentType: ComponentType, validation?: Validator[]) {
        if (componentType === 'checkboxes') {
            const _component: Checkboxes = {
                component: 'checkboxes',
                data: { value: [{ item: '', checked: false }] },
                colour: '#9e3d8a',
                icon: 'pi-check-square',
                label: 'Checklist',
                description: 'Track a list of items.',
                beta: false,
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
                icon: 'pi-folder',
                label: 'Files',
                description: 'Upload files for users to browse and download.',
                colour: '#3d4c9e',
                beta: false,
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
                icon: 'pi-images',
                label: 'Images',
                description: 'Upload images and display them in a gallery.',
                colour: '#8b9e3d',
                beta: false,
            };
            if (validation) {
                _component.validation = validation;
            }
            return _component;
        } else if (componentType === 'richTextInput') {
            const _component: RichTextInput = {
                data: { value: '' },
                component: 'richTextInput',
                icon: 'pi-large-text',
                label: 'Text',
                description: 'Capture notes and ideas with simple editing tools.',
                colour: '#3497ac',
                beta: false,
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
                icon: 'pi-table',
                label: 'Table',
                description: 'Organize data inside a simple table.',
                colour: '#34ac80',
                beta: false,
            };

            if (validation) {
                _component.validation = validation;
            }
            return _component;
        } else if (componentType === 'embed') {
            const _component: Embed = {
                data: { value: [{ href: '' }] },
                component: 'embed',
                icon: 'pi-embed',
                label: 'Embed',
                description: 'Embed third-party apps directly into a step.',
                colour: '#ac7434',
                beta: false,
            };

            if (validation) {
                _component.validation = validation;
            }
            return _component;
        } else if (componentType === 'pdf') {
            const _component: PDF = {
                data: { value: { href: '' } },
                component: 'pdf',
                icon: 'pi-file-pdf',
                label: 'PDF',
                description: 'Display a PDF with convenient controls.',
                colour: '#ac3434',
                beta: false,
            };

            if (validation) {
                _component.validation = validation;
            }
            return _component;
        } else {
            const _component: Draw = {
                data: { value: [{ x: 0, y: 0, lineWidth: 0 }] },
                component: 'draw',
                icon: 'pi-pencil',
                label: 'Whiteboard',
                description: 'Sketch out designs, diagrams, or anything else!',
                colour: '#643d9e',
                beta: true,
            };

            if (validation) {
                _component.validation = validation;
            }
            return _component;
        }
    }

    public getBlockMetaData() {
        const blockTypes: ComponentType[] = [
            'checkboxes',
            'fileUploader',
            'imageUploader',
            'richTextInput',
            'table',
            'embed',
            'pdf',
            'draw',
        ];
        const blocks: (Checkboxes | FileUploader | ImageUploader | RichTextInput | Table | Embed | PDF | Draw)[] = [];
        blockTypes.map(block => {
            let newBlock = this.createComponentMetadataTemplate(block);
            blocks.push(newBlock);
        });
        return blocks;
    }
}

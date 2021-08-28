import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
    BlockConfig,
    Checkboxes,
    ComponentMode,
    ComponentType,
    Embed,
    FileUploader,
    ImageUploader,
    RichTextInput,
    Table,
    TextInput,
    Validator,
} from '@stepflow/interfaces';
import { CheckboxesComponent } from './components/checkboxes/checkboxes.component';
import { EmbedComponent } from './components/embed/embed.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { RichTextInputComponent } from './components/rich-text-input/rich-text-input.component';
import { TableComponent } from './components/table/table.component';
import { TextInputComponent } from './components/text-input/text-input.component';

@Injectable({
    providedIn: 'root',
})
export class CoreComponentService {
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef
    ) {}

    public resolveComponent(
        componentType: ComponentType,
        index: number,
        field: BlockConfig,
        group: FormGroup,
        componentMode: ComponentMode
    ) {
        if (componentType === 'fileUploader') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(FileUploaderComponent);
            const _componentRef = this.viewContainerRef.createComponent<FileUploaderComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;
            _componentRef.instance.componentMode = componentMode;

            return _componentRef;
        } else if (componentType === 'checkboxes') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(CheckboxesComponent);
            const _componentRef = this.viewContainerRef.createComponent<CheckboxesComponent>(factory);
            _componentRef.instance.index = index;
            // _componentRef.instance.field = this.field;
            // _componentRef.instance.group = this.group;
            _componentRef.instance.componentMode = componentMode;

            return _componentRef;
        } else if (componentType === 'imageUploader') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(ImageUploaderComponent);
            const _componentRef = this.viewContainerRef.createComponent<ImageUploaderComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;
            _componentRef.instance.componentMode = componentMode;

            return _componentRef;
        } else if (componentType === 'richTextInput') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(RichTextInputComponent);
            const _componentRef = this.viewContainerRef.createComponent<RichTextInputComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;
            _componentRef.instance.componentMode = componentMode;

            return _componentRef;
        } else if (componentType === 'textInput') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(TextInputComponent);
            const _componentRef = this.viewContainerRef.createComponent<TextInputComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;
            _componentRef.instance.componentMode = componentMode;

            return _componentRef;
        } else if (componentType === 'table') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(TableComponent);
            const _componentRef = this.viewContainerRef.createComponent<TableComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;
            _componentRef.instance.componentMode = componentMode;

            return _componentRef;
        } else if (componentType === 'embed') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(EmbedComponent);
            const _componentRef = this.viewContainerRef.createComponent<EmbedComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;
            _componentRef.instance.componentMode = componentMode;

            return _componentRef;
        }

        return undefined;
    }

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

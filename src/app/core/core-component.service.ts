import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckboxesComponent } from './components/checkboxes/checkboxes.component';
import { EmbedComponent } from './components/embed/embed.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { LargeTextInputComponent } from './components/large-text-input/large-text-input.component';
import { TableComponent } from './components/table/table.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { BlockConfig, ComponentType } from './interfaces/core-component';

@Injectable({
    providedIn: 'root',
})
export class CoreComponentService {
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef
    ) {}

    public resolveComponent(componentType: ComponentType, index: number, field: BlockConfig, group: FormGroup) {
        if (componentType === 'fileUploader') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(FileUploaderComponent);
            const _componentRef = this.viewContainerRef.createComponent<FileUploaderComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;

            return _componentRef;
        } else if (componentType === 'checkboxes') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(CheckboxesComponent);
            const _componentRef = this.viewContainerRef.createComponent<CheckboxesComponent>(factory);
            _componentRef.instance.index = index;
            // _componentRef.instance.field = this.field;
            // _componentRef.instance.group = this.group;

            return _componentRef;
        } else if (componentType === 'imageUploader') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(ImageUploaderComponent);
            const _componentRef = this.viewContainerRef.createComponent<ImageUploaderComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;

            return _componentRef;
        } else if (componentType === 'largeTextInput') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(LargeTextInputComponent);
            const _componentRef = this.viewContainerRef.createComponent<LargeTextInputComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;

            return _componentRef;
        } else if (componentType === 'textInput') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(TextInputComponent);
            const _componentRef = this.viewContainerRef.createComponent<TextInputComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;

            return _componentRef;
        } else if (componentType === 'table') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(TableComponent);
            const _componentRef = this.viewContainerRef.createComponent<TableComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;

            return _componentRef;
        } else if (componentType === 'embed') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(EmbedComponent);
            const _componentRef = this.viewContainerRef.createComponent<EmbedComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;

            return _componentRef;
        }

        return undefined;
    }
}

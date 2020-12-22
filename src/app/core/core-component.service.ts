import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckboxesComponent } from './fields/checkboxes/checkboxes.component';
import { FileUploaderComponent } from './fields/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './fields/image-uploader/image-uploader.component';
import { LargeTextInputComponent } from './fields/large-text-input/large-text-input.component';
import { SmallTextInputComponent } from './fields/small-text-input/small-text-input.component';
import { TableComponent } from './fields/table/table.component';
import { UrlComponent } from './fields/url/url.component';
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
        } else if (componentType === 'smallTextInput') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(SmallTextInputComponent);
            const _componentRef = this.viewContainerRef.createComponent<SmallTextInputComponent>(factory);
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
        } else if (componentType === 'url') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(UrlComponent);
            const _componentRef = this.viewContainerRef.createComponent<UrlComponent>(factory);
            _componentRef.instance.field = field;
            _componentRef.instance.group = group;
            _componentRef.instance.index = index;

            return _componentRef;
        }

        return undefined;
    }
}

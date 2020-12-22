import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckboxesComponent } from './components/checkboxes/checkboxes.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { LargeTextInputComponent } from './components/large-text-input/large-text-input.component';
import { SmallTextInputComponent } from './components/small-text-input/small-text-input.component';
import { TableComponent } from './components/table/table.component';
import { UrlComponent } from './components/url/url.component';
import { BlockConfig, ComponentType } from './interfaces/core-component';

@Directive({
    selector: '[appCoreComponentResolver]',
})
export class CoreComponentResolverDirective implements OnInit {
    @Input() field!: BlockConfig;
    @Input() group!: FormGroup;
    @Input() index = 0;

    componentRef?: ComponentRef<
        | FileUploaderComponent
        | ImageUploaderComponent
        | LargeTextInputComponent
        | CheckboxesComponent
        | SmallTextInputComponent
        | TableComponent
        | UrlComponent
    >;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef
    ) {}

    ngOnInit() {
        const componentType: ComponentType = this.field.metadata.component;

        console.log(componentType);
        if (componentType === 'fileUploader') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(FileUploaderComponent);
            const _componentRef = this.viewContainerRef.createComponent<FileUploaderComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;

            this.componentRef = _componentRef;
        } else if (componentType === 'checkboxes') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(CheckboxesComponent);
            const _componentRef = this.viewContainerRef.createComponent<CheckboxesComponent>(factory);
            _componentRef.instance.index = this.index;
            _componentRef.instance.field = this.field;

            this.componentRef = _componentRef;
        } else if (componentType === 'imageUploader') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(ImageUploaderComponent);
            const _componentRef = this.viewContainerRef.createComponent<ImageUploaderComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;

            this.componentRef = _componentRef;
        } else if (componentType === 'largeTextInput') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(LargeTextInputComponent);
            const _componentRef = this.viewContainerRef.createComponent<LargeTextInputComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;

            this.componentRef = _componentRef;
        } else if (componentType === 'smallTextInput') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(SmallTextInputComponent);
            const _componentRef = this.viewContainerRef.createComponent<SmallTextInputComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;

            this.componentRef = _componentRef;
        } else if (componentType === 'table') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(TableComponent);
            const _componentRef = this.viewContainerRef.createComponent<TableComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;

            this.componentRef = _componentRef;
        } else if (componentType === 'url') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(UrlComponent);
            const _componentRef = this.viewContainerRef.createComponent<UrlComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;

            this.componentRef = _componentRef;
        }
    }
}

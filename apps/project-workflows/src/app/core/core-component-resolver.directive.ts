import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, ComponentType } from '@project-workflows/interfaces';
import { CheckboxesComponent } from './components/checkboxes/checkboxes.component';
import { DrawComponent } from './components/draw/draw.component';
import { EmbedComponent } from './components/embed/embed.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { PdfComponent } from './components/pdf/pdf.component';
import { RichTextInputComponent } from './components/rich-text-input/rich-text-input.component';
import { TableComponent } from './components/table/table.component';

@Directive({
    selector: '[appCoreComponentResolver]',
})
export class CoreComponentResolverDirective implements OnInit {
    @Input() field!: BlockConfig;
    @Input() group!: FormGroup;
    @Input() componentMode!: ComponentMode;
    @Input() index = 0;

    componentRef?: ComponentRef<
        | FileUploaderComponent
        | ImageUploaderComponent
        | RichTextInputComponent
        | CheckboxesComponent
        | TableComponent
        | EmbedComponent
        | PdfComponent
        | DrawComponent
    >;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef
    ) {}

    ngOnInit() {
        const componentType: ComponentType = this.field.metadata.component;

        if (componentType === 'fileUploader') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(FileUploaderComponent);
            const _componentRef = this.viewContainerRef.createComponent<FileUploaderComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;
            _componentRef.instance.componentMode = this.componentMode;

            this.componentRef = _componentRef;
        } else if (componentType === 'checkboxes') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(CheckboxesComponent);
            const _componentRef = this.viewContainerRef.createComponent<CheckboxesComponent>(factory);
            _componentRef.instance.index = this.index;
            _componentRef.instance.field = this.field;
            _componentRef.instance.componentMode = this.componentMode;

            this.componentRef = _componentRef;
        } else if (componentType === 'imageUploader') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(ImageUploaderComponent);
            const _componentRef = this.viewContainerRef.createComponent<ImageUploaderComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;
            _componentRef.instance.componentMode = this.componentMode;

            this.componentRef = _componentRef;
        } else if (componentType === 'richTextInput') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(RichTextInputComponent);
            const _componentRef = this.viewContainerRef.createComponent<RichTextInputComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;
            _componentRef.instance.componentMode = this.componentMode;

            this.componentRef = _componentRef;
        } else if (componentType === 'table') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(TableComponent);
            const _componentRef = this.viewContainerRef.createComponent<TableComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;
            _componentRef.instance.componentMode = this.componentMode;

            this.componentRef = _componentRef;
        } else if (componentType === 'embed') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(EmbedComponent);
            const _componentRef = this.viewContainerRef.createComponent<EmbedComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;
            _componentRef.instance.componentMode = this.componentMode;

            this.componentRef = _componentRef;
        } else if (componentType === 'pdf') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(PdfComponent);
            const _componentRef = this.viewContainerRef.createComponent<PdfComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;
            _componentRef.instance.componentMode = this.componentMode;

            this.componentRef = _componentRef;
        } else if (componentType === 'draw') {
            const factory = this.componentFactoryResolver.resolveComponentFactory(DrawComponent);
            const _componentRef = this.viewContainerRef.createComponent<DrawComponent>(factory);
            _componentRef.instance.field = this.field;
            _componentRef.instance.group = this.group;
            _componentRef.instance.index = this.index;
            _componentRef.instance.componentMode = this.componentMode;

            this.componentRef = _componentRef;
        }
    }
}

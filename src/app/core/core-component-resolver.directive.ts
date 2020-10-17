import { ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentType, FieldConfig } from '../models/interfaces/core-component';
import { CheckboxesComponent } from './fields/checkboxes/checkboxes.component';
import { FileUploaderComponent } from './fields/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './fields/image-uploader/image-uploader.component';
import { LargeTextInputComponent } from './fields/large-text-input/large-text-input.component';
import { PlaceholderComponent } from './fields/placeholder/placeholder.component';
import { SmallTextInputComponent } from './fields/small-text-input/small-text-input.component';
import { TableComponent } from './fields/table/table.component';

@Directive({
    selector: '[appCoreComponentResolver]',
})
export class CoreComponentResolverDirective implements OnInit {
    @Input() field!: FieldConfig;
    @Input() group!: FormGroup;

    componentRef: any;

    private componentMap: { [path in ComponentType]: any } = {
        fileUploader: FileUploaderComponent,
        imageUploader: ImageUploaderComponent,
        largeTextInput: LargeTextInputComponent,
        checkboxes: CheckboxesComponent,
        smallTextInput: SmallTextInputComponent,
        table: TableComponent,
        empty: PlaceholderComponent,
    };

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef
    ) {}

    ngOnInit() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(this.componentMap[this.field.type]);
        this.componentRef = this.viewContainerRef.createComponent(factory);

        this.componentRef.instance.field = this.field;
        this.componentRef.instance.group = this.group;
        this.componentRef.instance.componentMode = 'view';
    }
}

import { ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { CheckboxComponent } from './fields/checkbox/checkbox.component';
import { DropdownComponent } from './fields/dropdown/dropdown.component';
import { FileUploaderComponent } from './fields/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './fields/image-uploader/image-uploader.component';
import { LargeTextInputComponent } from './fields/large-text-input/large-text-input.component';
import { MultipleChoiceComponent } from './fields/multiple-choice/multiple-choice.component';
import { RadioButtonComponent } from './fields/radio-button/radio-button.component';
import { SmallTextInputComponent } from './fields/small-text-input/small-text-input.component';
import { TableComponent } from './fields/table/table.component';
import { ComponentType, FieldConfig } from '../models/interfaces/core-component';
import { FormGroup } from '@angular/forms';

import * as _ from 'lodash';

@Directive({
    selector: '[appCoreComponentResolver]',
})
export class CoreComponentResolverDirective implements OnInit {
    @Input() field!: FieldConfig;
    @Input() group!: FormGroup;

    componentRef: any;

    private componentMap: { [path in ComponentType]: any } = {
        checkbox: CheckboxComponent,
        dropdown: DropdownComponent,
        fileUploader: FileUploaderComponent,
        imageUploader: ImageUploaderComponent,
        largeTextInput: LargeTextInputComponent,
        linearScale: LargeTextInputComponent,
        multipleChoice: MultipleChoiceComponent,
        radioButton: RadioButtonComponent,
        smallTextInput: SmallTextInputComponent,
        table: TableComponent,
        empty: '',
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
    }
}

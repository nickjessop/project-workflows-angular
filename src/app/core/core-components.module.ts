import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LargeTextInputComponent } from './fields/large-text-input/large-text-input.component';
import { SmallTextInputComponent } from './fields/small-text-input/small-text-input.component';
import { CheckboxComponent } from './fields/checkbox/checkbox.component';
import { DropdownComponent } from './fields/dropdown/dropdown.component';
import { ImageUploaderComponent } from './fields/image-uploader/image-uploader.component';
import { FileUploaderComponent } from './fields/file-uploader/file-uploader.component';
import { LinearScaleComponent } from './fields/linear-scale/linear-scale.component';
import { MultipleChoiceComponent } from './fields/multiple-choice/multiple-choice.component';
import { TableComponent } from './fields/table/table.component';
import { RadioButtonComponent } from './fields/radio-button/radio-button.component';
import { CoreComponentResolverDirective } from './core-component-resolver.directive';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploaderComponent } from './fields/uploader/uploader.component';
import { CheckboxesComponent } from './fields/checkboxes/checkboxes.component';
import { ButtonComponent } from './components/button/button.component';
import { BaseFieldComponent } from './fields/base-field/base-field.component';
import { RouterModule } from '@angular/router';
import { LightboxComponent } from './components/lightbox/lightbox.component';

@NgModule({
    declarations: [
        LargeTextInputComponent,
        SmallTextInputComponent,
        CheckboxComponent,
        DropdownComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        LinearScaleComponent,
        MultipleChoiceComponent,
        TableComponent,
        RadioButtonComponent,
        CoreComponentResolverDirective,
        DynamicFormComponent,
        UploaderComponent,
        CheckboxesComponent,
        ButtonComponent,
        BaseFieldComponent,
        LightboxComponent,
    ],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
    exports: [
        LargeTextInputComponent,
        SmallTextInputComponent,
        CheckboxComponent,
        DropdownComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        LinearScaleComponent,
        MultipleChoiceComponent,
        TableComponent,
        RadioButtonComponent,
        DynamicFormComponent,
        UploaderComponent,
        CheckboxesComponent,
        ButtonComponent,
    ],
    entryComponents: [
        LargeTextInputComponent,
        SmallTextInputComponent,
        CheckboxComponent,
        ButtonComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        LinearScaleComponent,
        MultipleChoiceComponent,
        TableComponent,
        RadioButtonComponent,
        DynamicFormComponent,
        UploaderComponent,
        CheckboxesComponent,
    ],
})
export class CoreComponentsModule {}

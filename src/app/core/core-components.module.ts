import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../primeng/primeng.module';
import { ButtonComponent } from './components/button/button.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { LightboxComponent } from './components/lightbox/lightbox.component';
import { CoreComponentResolverDirective } from './core-component-resolver.directive';
import { BaseFieldComponent } from './fields/base-field/base-field.component';
import { CheckboxComponent } from './fields/checkbox/checkbox.component';
import { CheckboxesComponent } from './fields/checkboxes/checkboxes.component';
import { DropdownComponent } from './fields/dropdown/dropdown.component';
import { FileUploaderComponent } from './fields/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './fields/image-uploader/image-uploader.component';
import { LargeTextInputComponent } from './fields/large-text-input/large-text-input.component';
import { LinearScaleComponent } from './fields/linear-scale/linear-scale.component';
import { MultipleChoiceComponent } from './fields/multiple-choice/multiple-choice.component';
import { RadioButtonComponent } from './fields/radio-button/radio-button.component';
import { SmallTextInputComponent } from './fields/small-text-input/small-text-input.component';
import { TableComponent } from './fields/table/table.component';
import { UploaderComponent } from './fields/uploader/uploader.component';
import { PlaceholderComponent } from './fields/placeholder/placeholder.component';

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
        PlaceholderComponent,
    ],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PrimengModule],
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

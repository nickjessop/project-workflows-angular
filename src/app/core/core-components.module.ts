import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../primeng/primeng.module';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { CoreComponentResolverDirective } from './core-component-resolver.directive';
import { BaseFieldComponent } from './fields/base-field/base-field.component';
import { CheckboxesComponent } from './fields/checkboxes/checkboxes.component';
import { FileUploaderComponent } from './fields/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './fields/image-uploader/image-uploader.component';
import { LargeTextInputComponent } from './fields/large-text-input/large-text-input.component';
import { PlaceholderComponent } from './fields/placeholder/placeholder.component';
import { SmallTextInputComponent } from './fields/small-text-input/small-text-input.component';
import { TableComponent } from './fields/table/table.component';
import { UploaderComponent } from './fields/uploader/uploader.component';
import { UrlComponent } from './fields/url/url.component';

@NgModule({
    declarations: [
        LargeTextInputComponent,
        SmallTextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        CoreComponentResolverDirective,
        DynamicFormComponent,
        UploaderComponent,
        CheckboxesComponent,
        BaseFieldComponent,
        PlaceholderComponent,
        UrlComponent,
    ],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PrimengModule, DragDropModule],
    exports: [
        LargeTextInputComponent,
        SmallTextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        DynamicFormComponent,
        UploaderComponent,
        CheckboxesComponent,
        UrlComponent,
    ],
    entryComponents: [
        LargeTextInputComponent,
        SmallTextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        DynamicFormComponent,
        UploaderComponent,
        CheckboxesComponent,
        UrlComponent,
    ],
})
export class CoreComponentsModule {}

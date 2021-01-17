import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularResizedEventModule } from 'angular-resize-event';
import { PrimengModule } from '../primeng/primeng.module';
import { BaseFieldComponent } from './components/base-field/base-field.component';
import { CheckboxesComponent } from './components/checkboxes/checkboxes.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { EmbedComponent } from './components/embed/embed.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { LargeTextInputComponent } from './components/large-text-input/large-text-input.component';
import { SmallTextInputComponent } from './components/small-text-input/small-text-input.component';
import { TableComponent } from './components/table/table.component';
import { CoreComponentResolverDirective } from './core-component-resolver.directive';

@NgModule({
    declarations: [
        LargeTextInputComponent,
        SmallTextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        CoreComponentResolverDirective,
        DynamicFormComponent,
        CheckboxesComponent,
        BaseFieldComponent,
        EmbedComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimengModule,
        DragDropModule,
        AngularResizedEventModule,
        BrowserModule,
    ],
    exports: [
        LargeTextInputComponent,
        SmallTextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        DynamicFormComponent,
        CheckboxesComponent,
        EmbedComponent,
    ],
    entryComponents: [
        LargeTextInputComponent,
        SmallTextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        DynamicFormComponent,
        CheckboxesComponent,
        EmbedComponent,
    ],
})
export class CoreComponentsModule {}

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularResizeElementModule } from 'angular-resize-element';
import { PrimengModule } from '../primeng/primeng.module';
import { BaseFieldComponent } from './components/base-field/base-field.component';
import { CheckboxesComponent } from './components/checkboxes/checkboxes.component';
import { DragAndResizeComponent } from './components/drag-and-resize/drag-and-resize.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { EmbedComponent } from './components/embed/embed.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { RichTextInputComponent } from './components/rich-text-input/rich-text-input.component';
import { TableComponent } from './components/table/table.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { CoreComponentResolverDirective } from './core-component-resolver.directive';

@NgModule({
    declarations: [
        RichTextInputComponent,
        TextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        CoreComponentResolverDirective,
        DynamicFormComponent,
        CheckboxesComponent,
        BaseFieldComponent,
        EmbedComponent,
        DragAndResizeComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimengModule,
        DragDropModule,
        BrowserModule,
        AngularResizeElementModule,
    ],
    exports: [
        RichTextInputComponent,
        TextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        DynamicFormComponent,
        CheckboxesComponent,
        EmbedComponent,
        DragAndResizeComponent,
    ],
    entryComponents: [
        RichTextInputComponent,
        TextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        DynamicFormComponent,
        CheckboxesComponent,
        EmbedComponent,
        DragAndResizeComponent,
    ],
})
export class CoreComponentsModule {}

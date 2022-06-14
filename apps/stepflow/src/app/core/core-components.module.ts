import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ResizableModule } from 'angular-resizable-element';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxEditorModule } from 'ngx-editor';
import { PrimengModule } from '../primeng/primeng.module';
import { CheckboxesComponent } from './components/checkboxes/checkboxes.component';
import { DragAndResizeComponent } from './components/drag-and-resize/drag-and-resize.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { EmbedComponent } from './components/embed/embed.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { PdfComponent } from './components/pdf/pdf.component';
import { RichTextInputComponent } from './components/rich-text-input/rich-text-input.component';
import { TableComponent } from './components/table/table.component';
import { CoreComponentResolverDirective } from './core-component-resolver.directive';

@NgModule({
    declarations: [
        RichTextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        CoreComponentResolverDirective,
        DynamicFormComponent,
        CheckboxesComponent,
        EmbedComponent,
        DragAndResizeComponent,
        PdfComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PrimengModule,
        DragDropModule,
        BrowserModule,
        ResizableModule,
        PdfViewerModule,
        NgxEditorModule.forRoot({
            locals: {
                // menu
                bold: 'Bold',
                italic: 'Italic',
                code: 'Code',
                blockquote: 'Blockquote',
                underline: 'Underline',
                strike: 'Strike',
                bullet_list: 'Bullet List',
                ordered_list: 'Ordered List',
                // popups, forms, others...
                url: 'URL',
                text: 'Text',
                openInNewTab: 'Open in new tab',
                remove: 'Remove',
            },
        }),
    ],
    exports: [
        RichTextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        DynamicFormComponent,
        CheckboxesComponent,
        EmbedComponent,
        DragAndResizeComponent,
        PdfComponent,
    ],
    entryComponents: [
        RichTextInputComponent,
        ImageUploaderComponent,
        FileUploaderComponent,
        TableComponent,
        DynamicFormComponent,
        CheckboxesComponent,
        EmbedComponent,
        DragAndResizeComponent,
        PdfComponent,
    ],
})
export class CoreComponentsModule {}

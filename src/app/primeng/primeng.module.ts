import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FileUploadModule,
        BrowserAnimationsModule,
        AccordionModule,
        ButtonModule,
        InputTextareaModule,
        GalleriaModule,
        TableModule,
        DialogModule,
        InplaceModule,
        InputTextModule,
        OverlayPanelModule,
        ToolbarModule,
        CardModule,
    ],
    exports: [
        AccordionModule,
        ButtonModule,
        InputTextareaModule,
        GalleriaModule,
        TableModule,
        InplaceModule,
        InputTextModule,
        DialogModule,
        OverlayPanelModule,
        FileUploadModule,
        ToolbarModule,
        CardModule,
    ],
})
export class PrimengModule {}

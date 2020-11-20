import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
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
        ProgressSpinnerModule,
        TabViewModule,
        MenuModule,
        DropdownModule,
        MessagesModule,
        MessageModule,
        ToastModule,
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
        ProgressSpinnerModule,
        TabViewModule,
        MenuModule,
        DropdownModule,
        MessagesModule,
        MessageModule,
        ToastModule,
    ],
})
export class PrimengModule {}

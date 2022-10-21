import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

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
        SidebarModule,
        ConfirmDialogModule,
        CheckboxModule,
        ContextMenuModule,
        EditorModule,
        TooltipModule,
        ChipModule,
        ChipsModule,
        InputSwitchModule,
        SelectButtonModule,
        SkeletonModule,
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
        SidebarModule,
        ConfirmDialogModule,
        CheckboxModule,
        ContextMenuModule,
        EditorModule,
        TooltipModule,
        ChipModule,
        ChipsModule,
        InputSwitchModule,
        SelectButtonModule,
        SkeletonModule,
    ],
    providers: [ConfirmationService, MessageService],
})
export class PrimengModule {}

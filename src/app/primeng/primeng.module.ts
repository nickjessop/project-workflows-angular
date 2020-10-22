import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,

        BrowserAnimationsModule,
        AccordionModule,
        ButtonModule,
        InputTextareaModule,
        GalleriaModule,
        TableModule,
        DialogModule,
        InplaceModule,
        InputTextModule,
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
    ],
})
export class PrimengModule {}

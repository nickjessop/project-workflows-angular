import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        AccordionModule,
        ButtonModule,
        InputTextareaModule,
        GalleriaModule,
        TableModule,
        InplaceModule,
    ],
    exports: [AccordionModule, ButtonModule, InputTextareaModule, GalleriaModule, TableModule, InplaceModule],
})
export class PrimengModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {GalleriaModule} from 'primeng/galleria';
import {TableModule} from 'primeng/table';

@NgModule({
    declarations: [],
    imports: [CommonModule, AccordionModule, ButtonModule, InputTextareaModule, GalleriaModule, TableModule],
    exports: [AccordionModule, ButtonModule, InputTextareaModule, GalleriaModule, TableModule],
})
export class PrimengModule {}

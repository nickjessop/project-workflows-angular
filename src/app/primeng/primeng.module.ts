import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {GalleriaModule} from 'primeng/galleria';

@NgModule({
    declarations: [],
    imports: [CommonModule, AccordionModule, ButtonModule, InputTextareaModule, GalleriaModule],
    exports: [AccordionModule, ButtonModule, InputTextareaModule, GalleriaModule],
})
export class PrimengModule {}

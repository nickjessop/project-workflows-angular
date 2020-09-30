import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [],
    imports: [CommonModule, AccordionModule, ButtonModule],
    exports: [AccordionModule, ButtonModule],
})
export class PrimengModule {}

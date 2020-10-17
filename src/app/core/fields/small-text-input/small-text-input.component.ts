import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentMode, createFieldConfig, FieldConfig } from 'src/app/models/interfaces/core-component';

@Component({
    selector: 'app-small-text-input',
    templateUrl: './small-text-input.component.html',
    styleUrls: ['./small-text-input.component.scss'],
})
export class SmallTextInputComponent implements OnInit {
    @Input() field: FieldConfig = createFieldConfig();
    @Input() group!: FormGroup;
    @Input() componentMode: ComponentMode = 'view';

    constructor() {}

    ngOnInit() {}
}

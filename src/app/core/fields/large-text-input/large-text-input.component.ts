import { Component, OnInit, Input } from '@angular/core';
import { FieldConfig, ComponentMode, createFieldConfigDefault } from 'src/app/models/interfaces/core-component';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-large-text-input',
    templateUrl: './large-text-input.component.html',
    styleUrls: ['./large-text-input.component.scss'],
})
export class LargeTextInputComponent implements OnInit {
    @Input() field: FieldConfig = createFieldConfigDefault();
    @Input() group!: FormGroup;
    @Input() componentMode: ComponentMode = 'view';

    constructor() {}

    ngOnInit() {}
}

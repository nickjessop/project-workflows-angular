import { Component, OnInit, Input } from '@angular/core';
import { FieldConfig, ComponentMode } from 'src/app/models/interfaces/core-component';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-small-text-input',
    templateUrl: './small-text-input.component.html',
    styleUrls: ['./small-text-input.component.scss'],
})
export class SmallTextInputComponent implements OnInit {
    @Input() field!: FieldConfig;
    @Input() group!: FormGroup;
    @Input() componentMode: ComponentMode = 'view';

    constructor() {}

    ngOnInit() {}
}

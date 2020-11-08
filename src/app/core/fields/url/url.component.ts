import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentMode, createFieldConfig, FieldConfig } from 'src/app/models/interfaces/core-component';

@Component({
    selector: 'app-url',
    templateUrl: './url.component.html',
    styleUrls: ['./url.component.scss'],
})
export class UrlComponent implements OnInit {
    @Input() field: FieldConfig = createFieldConfig();
    @Input() group!: FormGroup;
    @Input() componentMode: ComponentMode = 'view';

    constructor() {}

    ngOnInit(): void {}
}

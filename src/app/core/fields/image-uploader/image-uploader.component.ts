import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../../models/interfaces/core-component';
import { FormGroup } from '@angular/forms';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent extends BaseFieldComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit() {}
}

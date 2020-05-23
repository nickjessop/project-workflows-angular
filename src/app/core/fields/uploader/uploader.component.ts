import { Component, OnInit, Input } from '@angular/core';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent extends BaseFieldComponent implements OnInit {
    @Input() icon = 'cloud_upload';

    constructor() {
        super();
    }

    ngOnInit() {}
}

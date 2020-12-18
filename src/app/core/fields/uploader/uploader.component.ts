import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project/project.service';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent extends BaseFieldComponent implements OnInit {
    @Input() icon = 'cloud_upload';
    // @Input() index?: number;

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {}
}

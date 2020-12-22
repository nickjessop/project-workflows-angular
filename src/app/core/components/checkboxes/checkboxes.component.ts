import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project/project.service';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-checkboxes',
    templateUrl: './checkboxes.component.html',
    styleUrls: ['./checkboxes.component.scss'],
})
export class CheckboxesComponent extends BaseFieldComponent implements OnInit {
    @Input() index = 0;

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {}
}

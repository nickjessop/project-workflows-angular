import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectService } from 'src/app/services/project/project.service';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-large-text-input',
    templateUrl: './large-text-input.component.html',
    styleUrls: ['./large-text-input.component.scss'],
})
export class LargeTextInputComponent extends BaseFieldComponent implements OnInit {
    // @Input() field: FieldConfig = createFieldConfig();
    @Input() group!: FormGroup;
    // @Input() componentMode: ComponentMode = 'view';
    // @Input() index = 0;

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {}
}

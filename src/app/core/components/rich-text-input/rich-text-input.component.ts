import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectService } from 'src/app/services/project/project.service';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-rich-text-input',
    templateUrl: './rich-text-input.component.html',
    styleUrls: ['./rich-text-input.component.scss'],
})
export class RichTextInputComponent extends BaseFieldComponent implements OnInit {
    // @Input() field: FieldConfig = createFieldConfig();
    @Input() group!: FormGroup;
    // @Input() componentMode: ComponentMode = 'view';
    // @Input() index = 0;

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {}
}

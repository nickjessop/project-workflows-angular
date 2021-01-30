import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectService } from 'src/app/services/project/project.service';
import { ComponentSettings, createComponentMetadataTemplate, TextInput } from '../../interfaces/core-component';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent extends BaseFieldComponent implements OnInit {
    // @Input() field: FieldConfig = createFieldConfig();
    @Input() group!: FormGroup;
    // @Input() componentMode: ComponentMode = 'view';
    // @Input() index = 0;

    public textInputData = createComponentMetadataTemplate('textInput') as TextInput;
    public settings?: ComponentSettings;

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {
        this.textInputData = this.field.metadata as TextInput;
        this.settings = this.textInputData.settings;
    }

    onFocusOut(event: { srcElement: { clientHeight: string } }) {
        const height = +event.srcElement.clientHeight + 10; //adds small buffer for view mode to avoid scrollbar
        this.textInputData.settings = { textInputComponent: { textareaHeight: height } };
    }
}

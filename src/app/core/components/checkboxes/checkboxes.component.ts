import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project/project.service';
import { Checkboxes } from '../../interfaces/core-component';
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

    public onAddCheckboxPress() {
        (this.field.metadata as Checkboxes).data.value.push({ item: '', checked: false });
    }

    public onCheckboxPress() {
        const test = (this.field.metadata as Checkboxes).data.value.sort(o1 => {
            return !!o1.checked ? 1 : -1;
        });

        this.field.metadata.data.value = test;
    }
}

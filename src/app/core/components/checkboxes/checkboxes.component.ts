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
        const test = (this.field.metadata as Checkboxes).data.value.sort((o1, o2) => {
            const o1Check = !!o1.checked;
            const o2Check = !!o2.checked;
            if ((o1Check ? 1 : -1) > (o2Check ? 1 : -1)) {
                return 1;
            }
            if ((o1Check ? 1 : -1) < (o2Check ? 1 : -1)) {
                return -1;
            }
            return 0;
        });

        this.field.metadata.data.value = test;
    }
}

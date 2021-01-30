import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MenuItem } from 'primeng/api';
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

    public getCheckboxMenuItems(index: number): MenuItem[] {
        return [
            {
                label: 'Delete item',
                icon: 'pi pi-trash',
                command: () => {
                    this.onCheckboxDeletePress(index);
                },
            },
        ];
    }

    ngOnInit() {}

    public onAddCheckboxPress() {
        const newCheckbox = { item: '', checked: false };

        (this.field.metadata as Checkboxes).data.value.splice(0, 0, newCheckbox);
    }

    public onCheckboxPress() {
        const sortedData = (this.field.metadata as Checkboxes).data.value.sort((o1, o2) => {
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

        this.field.metadata.data.value = sortedData;
    }

    public onCheckboxDeletePress(index: number) {
        console.log(index);
        (this.field.metadata as Checkboxes).data.value.splice(index, 1);
    }

    drop(event: CdkDragDrop<any>) {
        this.swapCheckboxOrder(event.previousIndex, event.currentIndex);
    }

    public swapCheckboxOrder(previousIndex: number, currentIndex: number) {
        const checkboxes = (this.field.metadata as Checkboxes).data.value;
        const _checkboxes = _.cloneDeep(checkboxes);
        moveItemInArray(_checkboxes!, previousIndex, currentIndex);
        this.field.metadata.data.value = _checkboxes;
    }
}

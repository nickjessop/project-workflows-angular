import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { BlockConfig, Checkboxes, ComponentMode, ComponentSettings } from '@stepflow/interfaces';
import * as _ from 'lodash';
import { ProjectService } from '../../../services/project/project.service';
import { CoreComponentService } from '../../core-component.service';
@Component({
    selector: 'app-checkboxes',
    templateUrl: './checkboxes.component.html',
    styleUrls: ['./checkboxes.component.scss'],
})
export class CheckboxesComponent implements OnInit {
    @Input() index = 0;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('checkboxes');
    @Input() resizable?: boolean;
    public componentMode: ComponentMode = 'view';
    public isEditing = false;
    public height?: number;
    public settings?: ComponentSettings;
    public checkboxesAmount = 0;

    constructor(private projectService: ProjectService, private coreComponentService: CoreComponentService) {}

    ngOnInit() {}

    public setComponentMode($event: ComponentMode) {
        this.componentMode = $event;
    }

    public onDeleteBlock() {
        const index = this.index ? this.index : 0;
        this.projectService.deleteProjectBlock(index);
    }

    public dragStarted() {
        this.projectService.setBlockDrag(true);
    }

    public dragFinished() {
        this.projectService.setBlockDrag(false);
    }

    public onAddCheckboxPress() {
        const newCheckbox = { item: '', checked: false };
        (this.field?.metadata as Checkboxes).data.value.splice(0, 0, newCheckbox);
        this.saveContent();
    }

    public onCheckboxPress() {
        const sortedData = (this.field?.metadata as Checkboxes).data.value.sort((o1, o2) => {
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
        this.projectService.syncProject();
    }

    public onCheckboxDeletePress(index: number) {
        console.log('delete?', index);
        (this.field.metadata as Checkboxes).data.value.splice(index, 1);
        this.saveContent();
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

    public saveContent() {
        this.projectService.syncProject();
        this.isEditing = false;
    }

    public onEdit() {
        this.isEditing = true;
    }
}

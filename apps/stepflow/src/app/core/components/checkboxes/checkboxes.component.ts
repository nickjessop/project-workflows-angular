import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { BlockConfig, Checkboxes, ComponentMode, ComponentSettings } from '@stepflow/interfaces';
import * as _ from 'lodash';
import { MenuItem } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { CoreComponentService } from '../../core-component.service';
@Component({
    selector: 'app-checkboxes',
    templateUrl: './checkboxes.component.html',
    styleUrls: ['./checkboxes.component.scss'],
})
export class CheckboxesComponent implements OnInit {
    @Input() index = 0;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('textInput');
    @Input() resizable?: boolean;
    public componentMode: ComponentMode = 'view';
    public showSaveButton: boolean = false;
    public height?: number;
    public settings?: ComponentSettings;

    public items: MenuItem[] = [
        {
            label: 'Delete Block',
            icon: 'pi pi-times',
            command: () => {
                this.onDeleteBlock();
            },
        },
    ];

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

    private updateHeight(height: number = 400) {
        if (!this.resizable) {
            return;
        }
        this.height = height;
        this.field.metadata.settings = { ...this.field.metadata.settings, height: height };
    }

    public saveTextblock() {
        this.showSaveButton = false;
        this.projectService.syncProject();
    }

    public onFocusIn() {
        this.showSaveButton = true;
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

    public onAddCheckboxPress() {
        const newCheckbox = { item: '', checked: false };
        (this.field?.metadata as Checkboxes).data.value.splice(0, 0, newCheckbox);
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
    }

    public onCheckboxDeletePress(index: number) {
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

    public saveContent() {
        // this.projectService.syncProject();
    }
}

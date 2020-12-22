import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BlockConfig, ComponentMode, createBlockConfig } from 'src/app/core/interfaces/core-component';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
    selector: 'app-base-field',
    templateUrl: './base-field.component.html',
    styleUrls: ['./base-field.component.scss'],
})
export class BaseFieldComponent {
    @Input() field: BlockConfig = createBlockConfig();
    @Input() index?: number;
    @Input() componentMode: ComponentMode = 'edit';

    public items: MenuItem[] = [
        {
            label: 'Delete Block',
            icon: 'pi pi-times',
            command: () => {
                this.onDeleteBlock();
            },
        },
    ];

    constructor(public projectService: ProjectService) {}

    ngOnInit() {}

    public onDeleteBlock() {
        const index = this.index ? this.index : 0;
        this.projectService.deleteProjectBlock(index);
    }
}

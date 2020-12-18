import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { createFieldConfig, FieldConfig } from 'src/app/models/interfaces/core-component';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
    selector: 'app-base-field',
    templateUrl: './base-field.component.html',
    styleUrls: ['./base-field.component.scss'],
})
export class BaseFieldComponent {
    @Input() field: FieldConfig = createFieldConfig();
    @Input() index?: number;

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
        if (this.index) {
            this.projectService.deleteProjectBlock(this.index);
        } else {
            console.log('No index for delete block was supplied');
        }
    }
}

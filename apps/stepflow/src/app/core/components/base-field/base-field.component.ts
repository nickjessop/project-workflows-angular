import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { BlockConfig, ComponentMode, createBlockConfig } from '../../interfaces/core-component';

@Component({
    selector: 'app-base-field',
    templateUrl: './base-field.component.html',
    styleUrls: ['./base-field.component.scss'],
})
export class BaseFieldComponent {
    @Input() field: BlockConfig = createBlockConfig('textInput');
    @Input() index?: number;
    @Input() componentMode: ComponentMode = 'edit';
    @Input() height?: number;
    // @Output() isDragging = new EventEmitter<boolean>();

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

    dragStarted() {
        // this.isDragging.emit(true);
        console.log('dragging');
        this.projectService.setBlockDrag(true);
    }

    dragFinished() {
        // this.isDragging.emit(false);
        console.log('drag finished');
        this.projectService.setBlockDrag(false);
    }
}

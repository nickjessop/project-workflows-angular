import { Component, Input } from '@angular/core';
import { BlockConfig, ComponentMode, ComponentSettings } from '@stepflow/interfaces';
// import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import { ResizeEvent } from 'angular-resizable-element';
import { MenuItem } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { CoreComponentService } from '../../core-component.service';

@Component({
    selector: 'project-drag-and-resize',
    templateUrl: './drag-and-resize.component.html',
    styleUrls: ['./drag-and-resize.component.scss'],
})
export class DragAndResizeComponent {
    @Input() isDraggable = false;
    @Input() componentMode: ComponentMode = 'view';
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('textInput');
    @Input() index = 0;
    @Input() resizable?: boolean;
    @Input() settings?: ComponentSettings;

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

    public onDeleteBlock() {
        this.projectService.deleteProjectBlock(this.index);
    }

    public dragStarted() {
        this.projectService.setBlockDrag(true);
    }

    public dragFinished() {
        this.projectService.setBlockDrag(false);
    }

    private updateHeight(height?: number) {
        if (!this.resizable) {
            return;
        }
        this.field.metadata.settings = { ...this.field.metadata.settings, height };
    }

    public onResizeEnd(event: ResizeEvent): void {
        console.log('Element was resized', event);
        const height = event.rectangle.height as number;
        this.updateHeight(height);
        this.projectService.syncProject();
    }

    public saveBlockData() {
        this.projectService.syncProject();
    }
}

import { Component, Input } from '@angular/core';
import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import { MenuItem } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { BlockConfig, ComponentMode, ComponentSettings, createBlockConfig } from '../../interfaces/core-component';

@Component({
    selector: 'project-drag-and-resize',
    templateUrl: './drag-and-resize.component.html',
    styleUrls: ['./drag-and-resize.component.scss'],
})
export class DragAndResizeComponent {
    @Input() isDraggable = false;
    @Input() componentMode: ComponentMode = 'view';
    @Input() field: BlockConfig = createBlockConfig('textInput');
    @Input() index = 0;
    @Input() resizable?: boolean;
    @Input() settings?: ComponentSettings;

    public readonly AngularResizeElementDirection = AngularResizeElementDirection;

    public items: MenuItem[] = [
        {
            label: 'Delete Block',
            icon: 'pi pi-times',
            command: () => {
                this.onDeleteBlock();
            },
        },
    ];

    constructor(private projectService: ProjectService) {}

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

    public onResize(evt: AngularResizeElementEvent): void {
        const height = evt.currentHeightValue as number;

        this.field.metadata.settings = { ...this.field.metadata.settings, height };
    }

    public onResizeEnd(evt: AngularResizeElementEvent): void {
        const height = evt.currentHeightValue as number;
        this.updateHeight(height);
        this.projectService.syncProject();
    }
}

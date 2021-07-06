import { Component, Input, OnInit } from '@angular/core';
import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import { MenuItem } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { ComponentMode, ComponentSettings, createBlockConfig } from '../../interfaces/core-component';
import { BlockConfig } from './../../interfaces/core-component';

@Component({
    selector: 'project-drag',
    templateUrl: './drag.component.html',
    styleUrls: ['./drag.component.scss'],
})
export class DragComponent implements OnInit {
    @Input() isDraggable = false;
    @Input() componentMode: ComponentMode = 'view';
    @Input() field: BlockConfig = createBlockConfig('textInput');
    @Input() index = 0;
    @Input() resizable?: boolean;
    @Input() height?: number;
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

    ngOnInit() {
        this.updateHeight();
    }

    public onDeleteBlock() {
        this.projectService.deleteProjectBlock(this.index);
    }

    public dragStarted() {
        // this.projectService.setBlockDrag(true);
    }

    public dragFinished() {
        // this.projectService.setBlockDrag(false);
    }

    private updateHeight(height: number = 400) {
        if (!this.resizable) {
            return;
        }
        this.height = height;
        // this.field.metadata.settings = { ...this.field.metadata.settings, height: height };
    }

    public onResize(evt: AngularResizeElementEvent): void {
        this.height = evt.currentHeightValue;
    }

    public onResizeEnd(evt: AngularResizeElementEvent): void {
        const height = evt.currentHeightValue;
        this.updateHeight(height);
    }
}

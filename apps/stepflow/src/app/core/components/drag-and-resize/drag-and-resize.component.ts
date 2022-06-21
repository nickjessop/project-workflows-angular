import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlockConfig, ComponentMetadata, ComponentMode, ComponentSettings } from '@stepflow/interfaces';
import { ResizeEvent } from 'angular-resizable-element';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../../services/project/project.service';
import { CoreComponentService } from '../../core-component.service';

@Component({
    selector: 'project-drag-and-resize',
    templateUrl: './drag-and-resize.component.html',
    styleUrls: ['./drag-and-resize.component.scss'],
})
export class DragAndResizeComponent {
    @Input() isDraggable = false;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('richTextInput');
    @Input() index = 0;
    @Input() resizable?: boolean;
    @Input() settings?: ComponentSettings;
    @Output() componentMode = new EventEmitter<ComponentMode>();

    public canConfigureBlocks: boolean = false;
    public canEditBlocks: boolean = false;
    public editMode: boolean = false;
    public subscriptions: Subscription = new Subscription();
    public blockMetaData!: ComponentMetadata;

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

    ngOnInit() {
        this.subscriptions.add(
            this.projectService.modesAvailable$.subscribe(val => {
                if (val.allowedProjectModes.configure === true) {
                    this.canConfigureBlocks = true;
                }
                if (val.allowedProjectModes.edit === true) {
                    this.canEditBlocks = true;
                }
            })
        );
        this.blockMetaData = this.coreComponentService.createComponentMetadataTemplate(this.field.metadata.component);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public onEditBlock() {
        this.componentMode.emit('edit');
        this.editMode = true;
    }

    public onSaveBlock() {
        this.projectService.syncProject();
    }

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
        const height = event.rectangle.height as number;
        this.updateHeight(height);
        this.projectService.syncProject();
    }

    public saveBlockData() {
        this.projectService.syncProject();
    }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockConfig, ComponentMetadata, ComponentMode, ComponentSettings } from '@stepflow/interfaces';
import { ResizeEvent } from 'angular-resizable-element';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CommentsService } from '../../../services/comments/comments.service';
import { ProjectService } from '../../../services/project/project.service';
import { CoreComponentService } from '../../core-component.service';

@Component({
    selector: 'project-drag-and-resize',
    templateUrl: './drag-and-resize.component.html',
    styleUrls: ['./drag-and-resize.component.scss'],
})
export class DragAndResizeComponent implements OnInit {
    @Input() isDraggable = false;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('richTextInput');
    @Input() index = 0;
    @Input() resizable?: boolean;
    @Input() settings?: ComponentSettings;
    @Output() componentMode = new EventEmitter<ComponentMode>();

    public canConfigureBlocks: boolean = false;
    public canEditBlocks: boolean = false;
    public editMode: boolean = true;
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

    constructor(
        private projectService: ProjectService,
        private coreComponentService: CoreComponentService,
        private commentsService: CommentsService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.subscriptions.add(
            this.projectService.modesAvailable$.subscribe(val => {
                if (val.allowedProjectModes.configure === true) {
                    this.canConfigureBlocks = true;
                }
                if (val.allowedProjectModes.edit === true) {
                    this.canEditBlocks = true;
                    this.componentMode.emit('edit');
                } else {
                    this.canEditBlocks = false;
                    this.componentMode.emit('view');
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
        this.saveBlockData();
    }

    public onAddComment() {
        this.commentsService.setBlockId(this.field.id);
    }

    public onPreviewBlock() {
        this.componentMode.emit('view');
        this.editMode = false;
    }

    public onDeleteBlock() {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this block? This action cannot be undone.',
            key: this.field.id,
            header: 'Delete block?',
            accept: () => {
                this.projectService.deleteProjectBlock(this.index);
            },
        });
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

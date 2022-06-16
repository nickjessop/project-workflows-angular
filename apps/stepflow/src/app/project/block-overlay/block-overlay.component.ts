import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ComponentType } from '@stepflow/interfaces';
@Component({
    selector: 'project-block-overlay',
    templateUrl: './block-overlay.component.html',
    styleUrls: ['./block-overlay.component.scss'],
})
export class BlockPanelOverlayComponent implements OnInit {
    @Output() onSelectNewBlock = new EventEmitter<ComponentType>();

    public blockOptions = this.getBlockOptions();

    public displayBlockSidebar = false;

    constructor() {}

    ngOnInit(): void {}

    private getBlockOptions() {
        const options = [
            {
                enabled: true,
                icon: 'pi-check-square',
                label: 'Checklist',
                description: 'Track a list of items.',
                component: 'checkboxes',
            },
            {
                enabled: true,
                icon: 'pi-folder',
                label: 'Files',
                description: 'Upload files for users to browse and download.',
                component: 'fileUploader',
            },
            {
                enabled: true,
                icon: 'pi-images',
                label: 'Images',
                description: 'Upload images and display them in a gallery.',
                component: 'imageUploader',
            },
            {
                enabled: true,
                icon: 'pi-large-text',
                label: 'Text',
                description: 'Capture notes and ideas with simple editing tools.',
                component: 'richTextInput',
            },
            {
                enabled: true,
                icon: 'pi-table',
                label: 'Table',
                description: 'Organize data inside a simple table.',
                component: 'table',
            },
            {
                enabled: true,
                icon: 'pi-embed',
                label: 'Embed',
                description: 'Embed third-party apps directly into a step.',
                component: 'embed',
            },
            {
                enabled: true,
                icon: 'pi-file-pdf',
                label: 'PDF',
                description: 'Display a PDF with convenient controls.',
                component: 'pdf',
            },
            {
                enabled: true,
                icon: 'pi-pencil',
                label: 'Whiteboard',
                description: 'Sketch out designs, diagrams, or anything else!',
                component: 'draw',
            },
        ];

        return options;
    }

    public showAddNewBlockDialog(target?: ViewChild) {
        this.displayBlockSidebar = true;
    }

    public onAddNewBlockPress(componentType: ComponentType) {
        this.onSelectNewBlock.emit(componentType);
        this.displayBlockSidebar = false;
    }
}

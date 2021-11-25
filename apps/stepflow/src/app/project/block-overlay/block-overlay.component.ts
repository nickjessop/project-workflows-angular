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
            { enabled: true, icon: 'pi-check-square', label: 'Checklist', component: 'checkboxes' },
            { enabled: true, icon: 'pi-folder', label: 'Files', component: 'fileUploader' },
            { enabled: true, icon: 'pi-images', label: 'Images', component: 'imageUploader' },
            { enabled: true, icon: 'pi-large-text', label: 'Text', component: 'richTextInput' },
            { enabled: true, icon: 'pi-table', label: 'Table', component: 'table' },
            { enabled: true, icon: 'pi-embed', label: 'Embed', component: 'embed' },
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

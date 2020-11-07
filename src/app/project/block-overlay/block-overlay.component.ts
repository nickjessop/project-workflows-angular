import { Component, OnInit, ViewChild } from '@angular/core';
import { Event } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ComponentType } from 'src/app/models/interfaces/core-component';

@Component({
    selector: 'project-block-overlay',
    templateUrl: './block-overlay.component.html',
    styleUrls: ['./block-overlay.component.scss'],
})
export class BlockPanelOverlayComponent implements OnInit {
    @ViewChild(OverlayPanel) overlayPanel?: OverlayPanel;

    public blockOptions: {
        [path in ComponentType]: { enabled: boolean; icon: string; label: string };
    } = this.getBlockOptions();

    constructor() {}

    ngOnInit(): void {}

    private getBlockOptions() {
        const options = {
            checkboxes: { enabled: true, icon: 'pi pi-ticket', label: 'Checkbox' },
            fileUploader: { enabled: true, icon: 'pi pi-ticket', label: 'File Uploader' },
            imageUploader: { enabled: true, icon: 'pi pi-ticket', label: 'Image Uploader' },
            smallTextInput: { enabled: true, icon: 'pi pi-ticket', label: 'Small Text Box' },
            largeTextInput: { enabled: true, icon: 'pi pi-ticket', label: 'Large Text Box' },
            table: { enabled: true, icon: 'pi pi-ticket', label: 'Table' },
            empty: { enabled: true, icon: 'pi pi-ticket', label: 'Checkbox' },
        };

        this.getObjectKeys(options);

        return options;
    }

    public getObjectKeys<T>(object: Map<T, T>) {
        const keys = Object.keys(object);
        console.log(keys);
    }

    public showAddNewBlockDialog($event: Event, target?: ViewChild) {
        this.overlayPanel?.show($event);
    }
}

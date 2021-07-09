import { Component, Input } from '@angular/core';
import { ProjectService } from '../../../services/project/project.service';
import { BlockConfig, createBlockConfig } from '../../interfaces/core-component';

@Component({
    selector: 'app-base-field',
    templateUrl: './base-field.component.html',
    styleUrls: ['./base-field.component.scss'],
})
export class BaseFieldComponent {
    @Input() field: BlockConfig = createBlockConfig('textInput');
    @Input() index?: number;
    // @Input() resizable?: boolean;

    // public height?: number;
    // public settings?: ComponentSettings;
    // public readonly AngularResizeElementDirection = AngularResizeElementDirection;

    // public items: MenuItem[] = [
    //     {
    //         label: 'Delete Block',
    //         icon: 'pi pi-times',
    //         command: () => {
    //             this.onDeleteBlock();
    //         },
    //     },
    // ];

    // public onDeleteBlock() {
    //     const index = this.index ? this.index : 0;
    //     this.projectService.deleteProjectBlock(index);
    // }

    // public dragStarted() {
    //     this.projectService.setBlockDrag(true);
    // }

    // public dragFinished() {
    //     this.projectService.setBlockDrag(false);
    // }

    // private updateHeight(height: number = 400) {
    //     if (!this.resizable) {
    //         return;
    //     }
    //     this.height = height;
    //     this.field.metadata.settings = { ...this.field.metadata.settings, height: height };
    // }

    // public onResize(evt: AngularResizeElementEvent): void {
    //     this.height = evt.currentHeightValue;
    // }

    // public onResizeEnd(evt: AngularResizeElementEvent): void {
    //     const height = evt.currentHeightValue;
    //     this.updateHeight(height);
    //     this.projectService.syncProject();
    // }

    constructor(public projectService: ProjectService) {}

    // ngOnInit() {
    //     this.updateHeight(this.field.metadata.settings?.height);
    // }
}

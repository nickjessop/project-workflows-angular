import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, ComponentSettings, TextInput } from '@stepflow/interfaces';
// import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import { MenuItem } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { CoreComponentService } from '../../core-component.service';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements OnInit {
    @Input() group!: FormGroup;
    @Input() field!: BlockConfig;
    @Input() index = 0;
    @Input() resizable?: boolean;
    @Input() componentMode?: ComponentMode;

    public textInputData = this.coreComponentService.createComponentMetadataTemplate('textInput') as TextInput;
    public settings?: ComponentSettings;

    constructor(private projectService: ProjectService, private coreComponentService: CoreComponentService) {}

    public height?: number;
    // public readonly AngularResizeElementDirection = AngularResizeElementDirection;

    public items: MenuItem[] = [
        {
            label: 'Delete Block',
            icon: 'pi pi-times',
            command: () => {
                this.onDeleteBlock();
            },
        },
    ];

    ngOnInit() {
        this.textInputData = this.field?.metadata as TextInput;
        this.settings = this.textInputData.settings;
    }

    public onDeleteBlock() {
        const index = this.index ? this.index : 0;
        this.projectService.deleteProjectBlock(index);
    }

    public dragStarted() {
        this.projectService.setBlockDrag(true);
    }

    public dragFinished() {
        this.projectService.setBlockDrag(false);
    }

    private updateHeight(height: number = 400) {
        if (!this.resizable) {
            return;
        }
        this.height = height;
        this.field.metadata.settings = { ...this.field.metadata.settings, height: height };
    }

    // public onResize(evt: AngularResizeElementEvent): void {
    //     this.height = evt.currentHeightValue;
    // }

    // public onResizeEnd(evt: AngularResizeElementEvent): void {
    //     const height = evt.currentHeightValue;
    //     this.updateHeight(height);
    //     this.projectService.syncProject();
    // }

    onFocusOut(event: { srcElement: { clientHeight: string } }) {
        const height = +event.srcElement.clientHeight + 10; //adds small buffer for view mode to avoid scrollbar
        this.textInputData.settings = { textInputComponent: { textareaHeight: height } };
    }
}

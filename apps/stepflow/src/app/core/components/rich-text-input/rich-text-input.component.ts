import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, ComponentSettings } from '@stepflow/interfaces';
import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import { MenuItem } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { CoreComponentService } from '../../core-component.service';

@Component({
    selector: 'app-rich-text-input',
    templateUrl: './rich-text-input.component.html',
    styleUrls: ['./rich-text-input.component.scss'],
})
export class RichTextInputComponent implements OnInit {
    @Input() group!: FormGroup;
    @Input() index = 0;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('textInput');
    @Input() resizable?: boolean;
    @Input() componentMode?: ComponentMode;
    // @ViewChild('textBlock')
    // textBlockElement!: ElementRef;

    constructor(private projectService: ProjectService, private coreComponentService: CoreComponentService) {}

    ngOnInit() {}

    public height?: number;
    public settings?: ComponentSettings;
    public readonly AngularResizeElementDirection = AngularResizeElementDirection;

    public keyStrokeCount: number = 1;

    public items: MenuItem[] = [
        {
            label: 'Delete Block',
            icon: 'pi pi-times',
            command: () => {
                this.onDeleteBlock();
            },
        },
    ];

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

    public onResize(evt: AngularResizeElementEvent): void {
        this.height = evt.currentHeightValue;
    }

    public onResizeEnd(evt: AngularResizeElementEvent): void {
        const height = evt.currentHeightValue;
        this.updateHeight(height);
        this.projectService.syncProject();
    }

    public onKeyup(event: Event) {
        // this.keyStrokeCount = this.keyStrokeCount + 1;
        // if (this.keyStrokeCount % 3 == 1) {
        //     this.projectService.syncProject();
        // }
        // this.textBlockElement.nativeElement.focus();
    }

    public onFocusOut(event: Event) {
        this.projectService.syncProject();
    }
}

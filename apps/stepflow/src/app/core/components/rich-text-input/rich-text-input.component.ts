import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, ComponentSettings } from '@stepflow/interfaces';
import { Editor, Toolbar, Validators } from 'ngx-editor';
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
    public componentMode: ComponentMode = 'view';
    public height?: number;
    public settings?: ComponentSettings;
    public editor!: Editor;
    public toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        ['link'],
    ];
    public html!: '';
    public showSaveButton: boolean = false;
    // public keyStrokeCount: number = 1;

    constructor(private projectService: ProjectService, private coreComponentService: CoreComponentService) {}

    form = new FormGroup({
        editorContent: new FormControl('', Validators.required()),
    });

    ngOnInit() {
        this.editor = new Editor();
        this.showSaveButton = false;
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    public setComponentMode($event: ComponentMode) {
        this.componentMode = $event;
    }

    // onChange(event: Event) {
    // add this to editor if needed: (ngModelChange)="onChange($event)"
    // }

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

    public onKeyup(event: Event) {
        // this.keyStrokeCount = this.keyStrokeCount + 1;
        // if (this.keyStrokeCount % 3 == 1) {
        //     this.projectService.syncProject();
        // }
        // this.textBlockElement.nativeElement.focus();
    }

    public onFocusIn(event: Event) {
        this.showSaveButton = true;
    }

    public onFocusOut(event: Event) {
        // this was almost working, but focusing on the url button forced an onFocusOut event
        // on-focusout on dom element
        this.projectService.syncProject();
        this.showSaveButton = false;
    }

    public saveTextblock() {
        this.showSaveButton = false;
        this.projectService.syncProject();
    }
}

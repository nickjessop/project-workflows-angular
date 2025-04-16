import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'new-project-dialog',
    templateUrl: './new-project-dialog.component.html',
    styleUrls: ['./new-project-dialog.component.scss'],
})
export class NewProjectDialogComponent implements OnInit {
    @Input() projectName = '';
    @Input() description = '';
    @Output() onCreateNewProject = new EventEmitter<{ projectName: string; description: string }>();

    public showDialog: boolean = false;
    public showProjectError: boolean = false;
    constructor() {}

    ngOnInit(): void {}

    public createNewProjectPress() {
        if (!this.projectName) {
            this.showProjectError = true;
            return;
        }

        this.onCreateNewProject.emit({ projectName: this.projectName, description: this.description });

        this.showDialog = false;
        this.resetDialog();
    }

    public showNewProjectDialog() {
        this.showDialog = true;
    }

    public resetDialog() {
        this.projectName = '';
        this.description = '';
        this.showProjectError = false;
    }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectService } from 'src/app/services/project/project.service';
import { FileUploader, Link } from '../../interfaces/core-component';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent extends BaseFieldComponent implements OnInit {
    @Input() group!: FormGroup;

    public cols = [
        { field: 'title', header: 'Name', size: '40' },
        { field: 'description', header: 'Description', size: '40' },
        { field: 'type', header: 'File Type', size: '10' },
        { field: 'href', header: 'Download', size: '10' },
    ];

    public fileData: Link[] = [{ href: '', title: '', description: '', altText: '', thumbnail: '' }];
    public dialogData: Link & { file?: File } = { href: '', title: '', description: '', altText: '' };

    public showFileUploaderDialog = false;

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {
        this.fileData = (this.field.metadata as FileUploader).data.value;
    }

    public onFileUploadSelected($event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        this.dialogData.file = $event.currentFiles[0];
        this.dialogData.title = $event.currentFiles[0].name;
        this.dialogData.type = $event.currentFiles[0].type;
    }

    private uploadFile(file: File) {
        // const successful = this.uploadFile($event.currentFiles[0]);

        // if (successful) {
        // } else {
        // }

        return true;
    }

    public onDialogSubmit($event: Event) {
        console.log($event);
    }
}

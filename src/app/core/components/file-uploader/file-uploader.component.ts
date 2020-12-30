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
        { field: 'description', header: 'Description', size: '50' },
        { field: 'href', header: 'Download', size: '10' },
    ];

    public fileData: Link[] = [{ href: '', title: '', description: '', altText: '', thumbnail: '' }];

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {
        this.fileData = (this.field.metadata as FileUploader).data.value;
    }

    public onFileUploadSelected($event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        // Some sort of validation here

        const successful = this.uploadFile($event.currentFiles[0]);

        if (successful) {
        } else {
        }
    }

    private uploadFile(file: File) {
        console.log(`Uploading file ${file.name}`);

        return true;
    }
}

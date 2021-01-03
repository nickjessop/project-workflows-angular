import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { ProjectService } from 'src/app/services/project/project.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FileUploader, Link } from '../../interfaces/core-component';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent extends BaseFieldComponent implements OnInit {
    @Input() group!: FormGroup;
    @ViewChild('fileUploader', { static: true }) fileUploaderButton!: FileUpload;

    public cols = [
        { field: 'title', header: 'Name', size: '40' },
        { field: 'description', header: 'Description', size: '40' },
        { field: 'type', header: 'File Type', size: '10' },
        { field: 'href', header: 'Download', size: '10' },
    ];

    public fileData: Link[] = [{ href: '', title: '', description: '', altText: '', thumbnail: '' }];
    public dialogData: Link & { file?: File } = { href: '', title: '', description: '', altText: '' };

    public showFileUploaderDialog = false;

    constructor(
        public projectService: ProjectService,
        private storageService: StorageService,
        private messageService: MessageService
    ) {
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

    public onDialogSubmit($event: Event) {
        const file = this.dialogData.file;

        if (!file) {
            return;
        }

        this.storageService.uploadFile(file).subscribe(
            success => {
                const { size, name, fullPath } = success.metadata;

                const downloadUrl = await this.storageService.getDownloadUrl(fullPath);
                // this.fileData.push({''})

                // href?: string | undefined;
                // title?: string | undefined;
                // description?: string | undefined;
                // thumbnail?: string | undefined;
                // altText?: string | undefined;
                // type?: string | undefined;
                this.resetDialog();
            },
            err => {
                this.messageService.add({
                    severity: 'error',
                    key: 'global-toast',
                    life: 3000,
                    closable: true,
                    detail: 'Failed to upload file',
                });
            }
        );
    }

    private resetDialog() {
        this.dialogData = { href: '', title: '', description: '', altText: '' };
        this.fileUploaderButton.clear();
        this.showFileUploaderDialog = false;
    }
}

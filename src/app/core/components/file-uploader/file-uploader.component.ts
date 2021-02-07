import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { map, switchMap } from 'rxjs/operators';
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
        { field: 'title', header: 'Name', size: '25' },
        { field: 'description', header: 'Description', size: '50' },
        { field: 'type', header: 'File Type', size: '10' },
        { field: 'href', header: 'Download', size: '15' },
        { field: 'delete', header: 'Delete', size: '10' },
    ];

    public fileData: Link[] = [{ href: '', title: '', description: '', thumbnail: '' }];
    public dialogData: Link & { file?: File } = { href: '', title: '', description: '' };

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

    public onFileDeletePress(index: number) {
        const filePath = this.fileData?.[index]?.filePath;

        if (filePath) {
            this.storageService.deleteFile(filePath).subscribe(
                () => {
                    // Successfully removed file
                    this.fileData.splice(index, 1);
                    this.projectService.syncProject();
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.fileData.splice(index, 1);
            this.projectService.syncProject();
        }
    }

    public onDialogSubmit($event: Event) {
        const file = this.dialogData.file;

        if (!file) {
            return;
        }

        this.storageService
            .uploadFile(file)
            .pipe(
                switchMap(file => {
                    return this.storageService.getDownloadUrl(file.metadata.fullPath).pipe(
                        map(downloadUrl => {
                            return {
                                fileMetadata: file.metadata,
                                downloadUrl: downloadUrl as string,
                                filePath: file.metadata.fullPath,
                            };
                        })
                    );
                })
            )
            .subscribe(
                filedata => {
                    const { name, size, fullPath } = filedata.fileMetadata;
                    const downloadUrl = filedata.downloadUrl;
                    this.fileData.push({ href: downloadUrl, title: name, size, filePath: fullPath });

                    this.projectService.syncProject();
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
        this.dialogData = { href: '', title: '', description: '' };
        this.fileUploaderButton.clear();
        this.showFileUploaderDialog = false;
    }
}

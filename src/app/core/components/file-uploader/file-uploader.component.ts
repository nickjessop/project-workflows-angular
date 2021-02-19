import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as mime from 'mime';
import { MenuItem, MessageService } from 'primeng/api';
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
        { field: 'title', header: 'Name', size: '30' },
        { field: 'description', header: 'Description', size: '50' },
        { field: 'type', header: 'Type', size: '10' },
        { field: 'menu', header: '', size: '10' },
    ];

    public fileData: Link[] = [{ href: '', title: '', description: '', thumbnail: '' }];
    public dialogData: Link & { file?: File } = { href: '', title: '', description: '' };

    public showFileUploaderDialog = false;
    public fileDialogMode = 'upload';

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

    public getFileMenuItems(index: number, file: Link): MenuItem[] {
        return [
            {
                label: 'Download file',
                icon: 'pi pi-download',
                command: () => {
                    this.onDownloadFilePress(file.href || '', file.title || '', file.extension || '');
                },
            },
            {
                label: 'Edit file',
                icon: 'pi pi-pencil',
                command: () => {
                    this.showFileUploaderDialog = true;
                    this.fileDialogMode = 'edit';
                    this.dialogData = file;
                },
            },
            {
                label: 'Delete file',
                icon: 'pi pi-trash',
                command: () => {
                    this.onFileDeletePress(index);
                },
            },
        ];
    }

    public onFileUploadSelected($event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        this.dialogData.file = $event.currentFiles[0];
        if ($event.currentFiles[0].name) {
            this.dialogData.title = $event.currentFiles[0].name;
        }
        this.dialogData.extension = mime.getExtension($event.currentFiles[0].type) || '';
        this.dialogData.type = $event.currentFiles[0].type.split('/')[0] || '';
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
                err => {
                    console.log(err);
                }
            );
        } else {
            this.fileData.splice(index, 1);
            this.projectService.syncProject();
        }
    }

    public onDownloadFilePress(href: string, title: string, extension: string) {
        // const downloadLink = document.getElementById('fileBlockDownload-' + index);
        const downloadLink = document.createElement('a');
        try {
            fetch(href)
                .then(res => res.blob())
                .then(blob => {
                    let url = URL.createObjectURL(blob);
                    downloadLink.href = url;
                    downloadLink.download = title + '.' + extension || 'download';
                    downloadLink.click();
                    const clickHandler = () => {
                        setTimeout(() => {
                            URL.revokeObjectURL(url);
                            downloadLink.removeEventListener('click', clickHandler);
                        }, 150);
                    };
                    downloadLink.addEventListener('click', clickHandler, false);
                });
        } catch (err) {
            this.messageService.add({
                severity: 'error',
                key: 'global-toast',
                life: 3000,
                closable: true,
                detail: 'Failed to download file',
            });
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
                    const { size, fullPath } = filedata.fileMetadata;
                    const { title, description, type, extension } = this.dialogData;
                    const downloadUrl = filedata.downloadUrl;
                    this.fileData.push({
                        href: downloadUrl,
                        title: title,
                        description: description,
                        size,
                        type,
                        extension,
                        filePath: fullPath,
                    });

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
    public resetDialog() {
        this.dialogData = { href: '', title: '', description: '' };
        if (this.fileUploaderButton) {
            this.fileUploaderButton.clear();
        }
        this.showFileUploaderDialog = false;
    }

    public updateFileMetadata(file: Link) {
        let index = this.fileData.indexOf(file);
        this.fileData[index] = file;
        this.projectService.syncProject();
    }
}

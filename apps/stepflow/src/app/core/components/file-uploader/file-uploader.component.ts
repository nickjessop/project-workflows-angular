import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, ComponentSettings, FileUploader, Link } from '@stepflow/interfaces';
// import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import * as mime from 'mime';
import { MenuItem, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { map, switchMap } from 'rxjs/operators';
import { ProjectService } from '../../../services/project/project.service';
import { StorageService } from '../../../services/storage/storage.service';
import { CoreComponentService } from '../../core-component.service';
@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {
    @ViewChild('fileUploader', { static: true }) fileUploaderButton!: FileUpload;

    @Input() group!: FormGroup;
    @Input() componentMode?: ComponentMode;
    @Input() index = 0;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('fileUploader');
    @Input() resizable?: boolean;

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
        private storageService: StorageService,
        private messageService: MessageService,
        private projectService: ProjectService,
        private coreComponentService: CoreComponentService
    ) {}

    ngOnInit() {
        const _fileData = (this.field.metadata as FileUploader).data.value;
        if (_fileData.length > 0 && _fileData[0].href === '') {
            (this.field.metadata as FileUploader).data.value = [];
            this.projectService.syncProject();
        }
        this.fileData = _fileData;
    }
    public height?: number;
    public settings?: ComponentSettings;
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
        const projectId = this.projectService.projectConfig.id;

        if (!file || !projectId) {
            return;
        }

        this.storageService
            .uploadProjectFile(file, projectId)
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

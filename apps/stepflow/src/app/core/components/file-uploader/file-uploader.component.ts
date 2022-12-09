import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, ComponentSettings, FileUploader, Link } from '@stepflow/interfaces';
import * as mime from 'mime';
import { MenuItem, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
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
    @Input() index = 0;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('fileUploader');
    @Input() resizable?: boolean;

    public cols = [
        { field: 'title', header: 'Name', size: '30' },
        { field: 'description', header: 'Description', size: '50' },
        { field: 'type', header: 'Type', size: '10' },
        { field: 'menu', header: '', size: '10' },
    ];

    public maxFileSize = 50 * 1024 * 1024;
    public fileData: Link[] = [{ href: '', title: '', description: '', thumbnail: '' }];
    public dialogData: Link & { file?: File } = { href: '', title: '', description: '' };
    public showFileUploaderDialog = false;
    public fileDialogMode = 'upload';
    public componentMode: ComponentMode = 'view';
    public height?: number;
    public settings?: ComponentSettings;

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

    public setComponentMode($event: ComponentMode) {
        this.componentMode = $event;
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

    public editFile(file: Link) {
        this.showFileUploaderDialog = true;
        this.fileDialogMode = 'edit';
        this.dialogData = file;
    }

    public onFileUploadSelected($event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        this.dialogData.file = $event.currentFiles[0];
        if ($event.currentFiles[0].name) {
            this.dialogData.title = $event.currentFiles[0].name;
        }
        this.dialogData.extension = mime.getExtension($event.currentFiles[0].type) || '';
        this.dialogData.type = $event.currentFiles[0].type.split('/')[0] || '';
    }

    public async onFileDeletePress(index: number) {
        const filePath = this.fileData?.[index]?.filePath;

        if (!filePath) {
            this.fileData.splice(index, 1);
            this.projectService.syncProject();
            return;
        }

        try {
            await this.storageService.deleteFile(filePath);

            this.fileData.splice(index, 1);
            this.projectService.syncProject();
        } catch (err) {
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

    public async onDialogSubmit($event: Event) {
        const file = this.dialogData.file;
        const projectId = this.projectService.projectConfig.id;

        if (!file || !projectId) {
            return;
        }

        const filedata = await this.storageService.uploadProjectFile(file, projectId);
        const downloadUrl: string = await this.storageService.getDownloadUrl(filedata.metadata.fullPath);
        const fileMetadata = filedata.metadata;
        const { size, fullPath } = fileMetadata;
        const { title, description, type, extension } = this.dialogData;

        this.fileData.push({
            href: downloadUrl,
            title,
            description,
            size,
            type,
            extension,
            filePath: fullPath,
        });

        this.projectService.syncProject();
        this.resetDialog();
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

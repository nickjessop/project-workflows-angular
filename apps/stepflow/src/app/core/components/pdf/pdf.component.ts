import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, Link, PDF } from '@stepflow/interfaces';
import { PDFProgressData } from 'ng2-pdf-viewer';
import { MessageService } from 'primeng/api';
import { map, switchMap } from 'rxjs';
import { ProjectService } from '../../../services/project/project.service';
import { StorageService } from '../../../services/storage/storage.service';
import { CoreComponentService } from '../../core-component.service';

@Component({
    selector: 'app-pdf',
    templateUrl: './pdf.component.html',
    styleUrls: ['./pdf.component.scss'],
})
export class PdfComponent implements OnInit {
    @Input() group!: FormGroup;
    @Input() index = 0;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('pdf');
    @Input() resizable = true;
    @Input() componentMode?: ComponentMode;

    public pdfData: Link = { href: '', title: '', filePath: '', type: '', size: 0 };
    public pdfFile: string = '';
    public pdfSize: any;
    public zoomSetting: number = 1;
    public rotateSetting: number = 0;
    public displaySpinner: boolean = false;
    public showDeleteDialog = false;

    constructor(
        public projectService: ProjectService,
        private storageService: StorageService,
        private messageService: MessageService,
        private coreComponentService: CoreComponentService
    ) {}

    ngOnInit(): void {
        const _pdfData = (this.field.metadata as PDF).data.value;
        this.pdfData = _pdfData;
        if (this.pdfData.size) {
            this.pdfSize = this.bytesToSize(this.pdfData.size);
        }
    }

    // public onRotatePDF(rotate: number) {
    //     // commenting this one out for now as you would need a way to save this setting
    //     <button
    //     pButton
    //     type="button"
    //     icon="pi pi-refresh"
    //     class="p-button-secondary"
    //     (onClick)="onRotatePDF(90)"
    //     ></button>
    //     this.rotateSetting += rotate;
    //     console.log(this.rotateSetting);
    // }

    private bytesToSize(bytes: number): string {
        const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return 'n/a';
        const i: number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
        if (i === 0) return `${bytes} ${sizes[i]}`;
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }

    public onZoomInPDF(zoom: number) {
        if (this.zoomSetting < 5) {
            this.zoomSetting += zoom;
        }
    }

    public onZoomOutPDF(zoom: number) {
        if (this.zoomSetting > 0.5) {
            this.zoomSetting -= zoom;
        }
    }

    public onProgress(progressData: PDFProgressData) {
        // option do something with progressData
        if (progressData.loaded != progressData.total) {
            this.displaySpinner = true;
        } else {
            this.displaySpinner = false;
        }
    }

    public deleteDialog() {}

    public onDeletePDF() {
        const filePath = this.pdfData.filePath;
        if (filePath) {
            this.storageService.deleteFile(filePath).subscribe(
                () => {
                    // Successfully removed file
                    this.projectService.syncProject();
                },
                (err) => {
                    console.log(err);
                }
            );
        } else {
            this.projectService.syncProject();
        }
        (this.field.metadata as PDF).data.value = { href: '', title: '', filePath: '', type: '', size: 0 };
        this.pdfData = { href: '', title: '', filePath: '', type: '', size: 0 };
        this.projectService.syncProject();
    }

    public closeDialog() {
        this.showDeleteDialog = false;
    }

    public onUploadPDF(event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        // Some sort of validation here
        this.pdfFile = event.currentFiles[0].name;
        this.uploadFile(event.currentFiles[0]);
    }

    private uploadFile(file: File) {
        const projectId = this.projectService.projectConfig.id;
        if (!file || !projectId) {
            return;
        }

        this.storageService
            .uploadProjectFile(file, projectId)
            .pipe(
                switchMap((file) => {
                    return this.storageService.getDownloadUrl(file.metadata.fullPath).pipe(
                        map((downloadUrl) => {
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
                (filedata) => {
                    const size = filedata.fileMetadata.size;
                    const name = file.name;
                    const downloadUrl = filedata.downloadUrl;
                    const filePath = filedata.filePath;
                    this.pdfData = {
                        href: downloadUrl,
                        title: name,
                        filePath: filePath,
                        size: size,
                    };
                    (this.field.metadata as PDF).data.value = this.pdfData;
                    this.projectService.syncProject();
                },
                (err) => {
                    this.messageService.add({
                        severity: 'error',
                        key: 'global-toast',
                        life: 3000,
                        closable: true,
                        detail: 'Failed to upload PDF',
                    });
                }
            );
    }
}

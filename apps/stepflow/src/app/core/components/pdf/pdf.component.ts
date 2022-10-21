import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, Link, PDF } from '@stepflow/interfaces';
import { PDFProgressData } from 'ng2-pdf-viewer';
import { MessageService } from 'primeng/api';
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
    public componentMode: ComponentMode = 'view';

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

    public setComponentMode($event: ComponentMode) {
        this.componentMode = $event;
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

    public async onDeletePDF() {
        const filePath = this.pdfData.filePath;
        if (filePath) {
            const success = await this.storageService.deleteFile(filePath);

            if (success) {
                this.projectService.syncProject();
            } else {
                console.log('Error onDeletePDF()');
            }
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

    private async uploadFile(file: File) {
        const projectId = this.projectService.projectConfig.id;
        if (!file || !projectId) {
            return;
        }

        const filedata = await this.storageService.uploadProjectFile(file, projectId);
        const downloadUrl: string = await this.storageService.getDownloadUrl(filedata.metadata.fullPath);

        const fileMetadata = filedata.metadata;
        const filePath = fileMetadata.fullPath;
        const filename = fileMetadata.name;
        const size = fileMetadata.size;
        const height = 400; // sets a reasonable default height

        this.pdfData = {
            href: downloadUrl,
            title: filename,
            filePath,
            size,
        };

        (this.field.metadata as PDF).data.value = this.pdfData;
        this.field.metadata.settings = { ...this.field.metadata.settings, height };
        this.projectService.syncProject();
    }
}

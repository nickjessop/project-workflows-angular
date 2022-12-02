import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, ComponentSettings, ImageUploader, Link } from '@stepflow/interfaces';
import { MenuItem, MessageService } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { StorageService } from '../../../services/storage/storage.service';
import { CoreComponentService } from '../../core-component.service';

@Component({
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent implements OnInit {
    @Input() group!: FormGroup;
    @Input() index = 0;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('imageUploader');
    @Input() resizable?: boolean;

    public maxFileSize = 10 * 1024 * 1024;
    public responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ];
    public activeIndex = 0;
    public displayLightbox = false;
    public showThumbnails: boolean = false;
    public showImageUploaderDialog = false;
    public imageData: Link[] = [];
    public selectedImages: number[] = [];
    public componentMode: ComponentMode = 'view';
    public height?: number;
    public settings?: ComponentSettings;

    constructor(
        public projectService: ProjectService,
        private storageService: StorageService,
        private messageService: MessageService,
        private coreComponentService: CoreComponentService
    ) {}

    public items: MenuItem[] = [
        {
            label: 'Delete Block',
            icon: 'pi pi-times',
            command: () => {
                this.onDeleteBlock();
            },
        },
    ];

    public columnSizes(): Object {
        if (this.imageData.length > 1 && this.imageData.length < 7) {
            return { 'column-count': 2, '-webkit-column-count': 2, '-moz-column-count': 2 };
        } else if (this.imageData.length === 1) {
            return { 'column-count': 1, '-webkit-column-count': 1, '-moz-column-count': 1 };
        }
        return {};
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

    ngOnInit() {
        const _imageData = (this.field.metadata as ImageUploader).data.value;
        if (_imageData.length > 0 && _imageData[0].href === '') {
            (this.field.metadata as ImageUploader).data.value = [];
            this.projectService.syncProject();
        }
        this.imageData = _imageData;
    }

    public imageClick(index: number) {
        this.activeIndex = index;
        this.displayLightbox = true;
    }

    public onThumbnailButtonClick() {
        this.showThumbnails = !this.showThumbnails;
    }

    public onCheckboxPress($event: { checked: boolean }, imageIndex: number) {
        if ($event.checked) {
            this.selectedImages.push(imageIndex);
        } else {
            const index = this.selectedImages.indexOf(imageIndex);
            if (index > -1) {
                this.selectedImages.splice(index, 1);
            }
        }
    }

    public onFileUploadSelected($event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        // Some sort of validation here
        this.uploadFile($event.currentFiles[0]);
    }

    public async onDeleteImagePress() {
        let index = this.selectedImages.length;
        while (index--) {
            const imageIndex = this.selectedImages[index];
            const filePath = this.imageData?.[imageIndex]?.filePath;
            if (filePath) {
                this.imageData.splice(imageIndex, 1);
                this.selectedImages.splice(index, 1);
                const success = await this.storageService.deleteFile(filePath);
                if (success) {
                    this.projectService.syncProject();
                }
            } else {
                console.log('no file path');
                this.imageData.splice(imageIndex, 1);
                this.selectedImages.splice(index, 1);
                this.projectService.syncProject();
            }
        }
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
        const size = fileMetadata.size;
        const name = fileMetadata.name;

        this.imageData.push({
            href: downloadUrl,
            thumbnail: downloadUrl,
            title: name,
            filePath,
            size,
        });

        this.projectService.syncProject();
    }

    public updateImageMetadata(image: Link) {
        let index = this.imageData.indexOf(image);
        this.imageData[index] = image;
        this.projectService.syncProject();
    }
}

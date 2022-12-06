import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, ComponentSettings, ImageUploader, Link } from '@stepflow/interfaces';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
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
    public _imageData: Link[] = []; // clone to have a reference of original data
    public selectedImages: number[] = [];
    public componentMode: ComponentMode = 'view';
    public height?: number;
    public settings?: ComponentSettings;

    constructor(
        public projectService: ProjectService,
        private storageService: StorageService,
        private messageService: MessageService,
        private coreComponentService: CoreComponentService,
        private confirmationService: ConfirmationService
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
        // modify number of cols depending on # of images uploaded
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
        this._imageData = [..._imageData];
    }

    public enlargeImage(index: number) {
        this.activeIndex = index;
        this.displayLightbox = true;
    }

    public selectImage(imageIndex: number) {
        if (this.selectedImages.includes(imageIndex)) {
            // find index and only splice array when item is found
            const index = this.selectedImages.indexOf(imageIndex);
            if (index > -1) {
                this.selectedImages.splice(index, 1);
            }
        } else {
            this.selectedImages.push(imageIndex);
        }
    }

    public onThumbnailButtonClick() {
        this.showThumbnails = !this.showThumbnails;
    }

    public onFileUploadSelected($event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        // Some sort of validation here
        this.uploadFile($event.currentFiles[0]);
    }

    public onDeleteImagePress() {
        let index = this.selectedImages.length;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to remove these images? This action cannot be undone.',
            key: this.field.id + '-gallery',
            header: 'Remove images?',
            accept: async () => {
                const result = await this.deleteImages(index as number);
                if (result) {
                    this.projectService.syncProject();
                }
            },
        });
    }

    private async deleteImages(index: number) {
        while (index--) {
            const imageIndex = this.selectedImages[index];
            const filePath = this._imageData?.[imageIndex]?.filePath;
            if (filePath) {
                await this.storageService
                    .deleteFile(filePath)
                    .then(res => {
                        console.log('Document successfully deleted!');
                        this.imageData.splice(imageIndex, 1);
                        this.selectedImages.splice(index, 1);
                        return res;
                    })
                    .catch(error => {
                        console.error('Error removing documents: ', error);
                        return error;
                    });
            } else {
                // no file path
                this.imageData.splice(imageIndex, 1);
                this.selectedImages.splice(index, 1);
            }
        }
        if (this.selectedImages.length === 0) {
            return true;
        } else {
            return false;
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
        const name = file.name;

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

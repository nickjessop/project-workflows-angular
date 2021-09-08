import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, ComponentSettings, ImageUploader, Link } from '@stepflow/interfaces';
import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import { MenuItem, MessageService } from 'primeng/api';
import { map, switchMap } from 'rxjs/operators';
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
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('textInput');
    @Input() resizable?: boolean;
    @Input() componentMode?: ComponentMode;

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

    public imageData: Link[] = [{ href: '', title: '', description: '', thumbnail: '', filePath: '' }];
    public selectedImages: number[] = [];

    constructor(
        public projectService: ProjectService,
        private storageService: StorageService,
        private messageService: MessageService,
        private coreComponentService: CoreComponentService
    ) {}

    public height?: number;
    public settings?: ComponentSettings;
    public readonly AngularResizeElementDirection = AngularResizeElementDirection;

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

    public onResize(evt: AngularResizeElementEvent): void {
        this.height = evt.currentHeightValue;
    }

    public onResizeEnd(evt: AngularResizeElementEvent): void {
        const height = evt.currentHeightValue;
        this.updateHeight(height);
        this.projectService.syncProject();
    }

    ngOnInit() {
        this.imageData = (this.field.metadata as ImageUploader).data.value;
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

    public onDeleteImagePress() {
        let index = this.selectedImages.length;
        while (index--) {
            const imageIndex = this.selectedImages[index];
            const filePath = this.imageData?.[imageIndex]?.filePath;
            if (filePath) {
                this.imageData.splice(imageIndex, 1);
                this.selectedImages.splice(index, 1);
                this.storageService.deleteFile(filePath).subscribe(
                    () => {
                        //Successfully removed file
                        this.projectService.syncProject();
                    },
                    error => {
                        console.log(error);
                    }
                );
            } else {
                console.log('no file path');
                this.imageData.splice(imageIndex, 1);
                this.selectedImages.splice(index, 1);
                this.projectService.syncProject();
            }
        }
    }

    private uploadFile(file: File) {
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
                    const size = filedata.fileMetadata.size;
                    const name = file.name;
                    const downloadUrl = filedata.downloadUrl;
                    const filePath = filedata.filePath;
                    this.imageData.push({
                        href: downloadUrl,
                        thumbnail: downloadUrl,
                        title: name,
                        filePath: filePath,
                        size,
                    });
                    this.projectService.syncProject();
                },
                err => {
                    this.messageService.add({
                        severity: 'error',
                        key: 'global-toast',
                        life: 3000,
                        closable: true,
                        detail: 'Failed to upload image',
                    });
                }
            );
    }

    public updateImageMetadata(image: Link) {
        let index = this.imageData.indexOf(image);
        this.imageData[index] = image;
        this.projectService.syncProject();
    }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { map, switchMap } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project/project.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ImageUploader, Link } from '../../interfaces/core-component';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent extends BaseFieldComponent implements OnInit {
    @Input() group!: FormGroup;

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

    public imageData: Link[] = [{ href: '', title: '', description: '', thumbnail: '' }];
    public selectedImages: number[] = [];
    // public _selectImages: number[] = [];

    constructor(
        public projectService: ProjectService,
        private storageService: StorageService,
        private messageService: MessageService
    ) {
        super(projectService);
    }

    ngOnInit() {
        this.imageData = (this.field.metadata as ImageUploader).data.value;
        console.log(this.selectedImages);
    }

    public imageClick(index: number) {
        this.activeIndex = index;
        this.displayLightbox = true;
    }

    public onThumbnailButtonClick() {
        this.showThumbnails = !this.showThumbnails;
    }

    public onCheckboxPress($event: { checked: boolean }, imageIndex: number) {
        // console.log(imageIndex);
        // console.log($event);
        // let _selectedImages = [...this.selectedImages];
        if ($event.checked) {
            this.selectedImages.push(imageIndex);
            // this.selectedImages = _selectedImages;
            console.log(this.selectedImages);
        } else {
            const index = this.selectedImages.indexOf(imageIndex);
            if (index > -1) {
                this.selectedImages.splice(index, 1);
            }
            console.log(this.selectedImages);
        }
    }

    public onFileUploadSelected($event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        // Some sort of validation here

        this.uploadFile($event.currentFiles[0]);
    }

    public onDeleteImagePress(index: number) {
        const filePath = this.imageData?.[index]?.filePath;

        if (filePath) {
            this.storageService.deleteFile(filePath).subscribe(
                () => {
                    // Successfully removed file
                    this.imageData.splice(index, 1);
                    this.projectService.syncProject();
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.imageData.splice(index, 1);
            this.projectService.syncProject();
        }
    }

    private uploadFile(file: File) {
        this.storageService
            .uploadFile(file)
            .pipe(
                switchMap(file => {
                    return this.storageService.getDownloadUrl(file.metadata.fullPath).pipe(
                        map(downloadUrl => {
                            return { fileMetadata: file.metadata, downloadUrl: downloadUrl as string };
                        })
                    );
                })
            )
            .subscribe(
                filedata => {
                    const { name, size } = filedata.fileMetadata;
                    const downloadUrl = filedata.downloadUrl;
                    this.imageData.push({ href: downloadUrl, thumbnail: downloadUrl, title: name, size });
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
}

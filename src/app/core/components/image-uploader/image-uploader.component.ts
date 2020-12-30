import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectService } from 'src/app/services/project/project.service';
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

    public imageData: Link[] = [{ href: '', title: '', description: '', altText: '', thumbnail: '' }];

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {
        this.imageData = (this.field.metadata as ImageUploader).data.value;
    }

    public imageClick(index: number) {
        this.activeIndex = index;
        this.displayLightbox = true;
    }

    public onFileUploadSelected($event: { originalEvent: Event; files: FileList; currentFiles: File[] }) {
        // Some sort of validation here

        this.uploadFile($event.currentFiles[0]);
    }

    private uploadFile(file: File) {
        console.log(`Uploading file ${file.stream}`);
    }
}

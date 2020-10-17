import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentMode, createFieldConfig, FieldConfig } from 'src/app/models/interfaces/core-component';

@Component({
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent implements OnInit {
    @Input() field: FieldConfig = createFieldConfig();
    @Input() group!: FormGroup;
    @Input() componentMode: ComponentMode = 'view';

    images = [
        {
            path: 'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria1.jpg',
            thumbnail: 'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria1s.jpg',
            alt: 'flower',
            title: 'An odd looking flower',
        },
        {
            path: 'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria2.jpg',
            thumbnail: 'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria2s.jpg',
            alt: 'fog',
            title: 'Chill fog',
        },
        {
            path: 'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria3.jpg',
            thumbnail: 'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria3s.jpg',
            alt: 'dead dandelion',
            title: 'Is this danelion dead?',
        },
        {
            path: 'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria4.jpg',
            thumbnail: 'https://primefaces.org/primeng/showcase/assets/showcase/images/galleria/galleria4s.jpg',
            alt: 'flower',
            title: 'Another odd flower',
        },
    ];

    responsiveOptions: any[] = [
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

    activeIndex: number = 0;

    displayLightbox: boolean = false;

    constructor() {}

    ngOnInit() {}

    imageClick(index: number) {
        this.activeIndex = index;
        this.displayLightbox = true;
    }
}

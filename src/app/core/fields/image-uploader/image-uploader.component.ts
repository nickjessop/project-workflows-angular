import { Component, OnInit, Input } from '@angular/core';
import { FieldConfig, ComponentMode, createFieldConfigDefault } from 'src/app/models/interfaces/core-component';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent implements OnInit {

    @Input() field: FieldConfig = createFieldConfigDefault();
    @Input() group!: FormGroup;
    @Input() componentMode: ComponentMode = 'view';

    images = [
		{
            path: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/19a4ae25434871.563453b964a2b.jpg',
            alt: 'flower',
            title: 'An odd looking flower'
		},
		{
            path: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/7ac9f625434871.563453b97867a.jpg',
            alt: 'fog',
            title: 'Chill fog'
		},
		{
            path: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/5f8a3c25434871.563453b95d980.jpg',
            alt: 'dead dandelion',
            title: 'Is this danelion dead?'
		},
		{
            path: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/d7550725434871.563453b951273.jpg',
            alt: 'flower',
            title: 'Another odd flower'
		},
	];

    responsiveOptions:any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    activeIndex: number = 0;

    displayLightbox: boolean = false;

    constructor() {

    }

    ngOnInit() {

    }

    imageClick(index: number) {
        this.activeIndex = index;
        this.displayLightbox = true;
    }

}

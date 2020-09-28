import { Component, OnInit, Input } from '@angular/core';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent extends BaseFieldComponent implements OnInit {

    showLightbox = false;
    imagePath: string | undefined;
    imageTitle: string | undefined;
    imageAltText: string | undefined;

    constructor() {
        super();
    }

    ngOnInit() {}

    openLightbox(image: string, title: string, alt: string){
        this.showLightbox = true;
        this.imagePath = image;
        this.imageTitle = title;
        this.imageAltText = alt;
    }

    onCloseLightbox() {
        this.showLightbox = false;
    }

    images = [
		{
            path: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/19a4ae25434871.563453b964a2b.jpg',
            altText: 'flower',
            title: 'An odd looking flower'
		},
		{
            path: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/7ac9f625434871.563453b97867a.jpg',
            altText: 'fog',
            title: 'Chill fog'
		},
		{
            path: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/5f8a3c25434871.563453b95d980.jpg',
            altText: 'dead dandelion',
            title: 'Is this danelion dead?'
		},
		{
            path: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/d7550725434871.563453b951273.jpg',
            altText: 'flower',
            title: 'Another odd flower'
		},
	];
}

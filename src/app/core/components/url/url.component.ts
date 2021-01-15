import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResizedEvent } from 'angular-resize-event';
import { ProjectService } from 'src/app/services/project/project.service';
import { ComponentSettings, createComponentMetadataTemplate, Url } from '../../interfaces/core-component';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-url',
    templateUrl: './url.component.html',
    styleUrls: ['./url.component.scss'],
})
export class UrlComponent extends BaseFieldComponent implements OnInit {
    @Input() group!: FormGroup;

    public urlData = createComponentMetadataTemplate('url') as Url;
    public settings?: ComponentSettings;
    public cleanUrl: SafeResourceUrl = '';
    public href: string = '';
    public domain: { hostname: string } = { hostname: '' };
    // public height: number = this.urlData.data.value.height;
    public height: number = 400;

    constructor(public projectService: ProjectService, private domSantizer: DomSanitizer) {
        super(projectService);
    }

    ngOnInit(): void {
        this.urlData = this.field.metadata as Url;

        this.cleanUrl = this.domSantizer.bypassSecurityTrustResourceUrl(this.urlData.data.value.href || '');
        // if (this.urlData.data.value) {
        //     this.domain = new URL(this.urlData.data.value.href);
        // }
        console.log(this.urlData.data.value.height);
        console.log(this.urlData.settings?.urlComponent?.iframeHeight);

        this.settings = this.urlData.settings;
    }

    public onAddNewUrlPress() {
        this.urlData.data.value[0].href = this.href;
        this.href = '';
    }
    public onRemoveUrlPress() {
        this.urlData.data.value[0].href = '';
    }

    public onResized(event: ResizedEvent) {
        this.height = event.newHeight;
    }
    public onMouseUp(event: ResizedEvent) {
        this.urlData.data.value.height = this.height;
        console.log(event);

        const someHeightValue = 2;

        this.settings = { urlComponent: { iframeHeight: someHeightValue } };
    }
}

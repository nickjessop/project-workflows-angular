import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
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

    constructor(
        public projectService: ProjectService,
        private domSantizer: DomSanitizer,
        private messageService: MessageService
    ) {
        super(projectService);
    }

    ngOnInit(): void {
        this.urlData = this.field.metadata as Url;

        this.cleanUrl = this.domSantizer.bypassSecurityTrustResourceUrl(this.urlData.data.value[0].href || '');

        try {
            if (this.urlData.data.value[0].href) {
                this.domain = new URL(this.urlData.data.value[0].href);
            }
        } catch (e) {
            this.domain.hostname = '';
        }

        this.settings = this.urlData.settings;
    }

    public onAddNewUrlPress() {
        const message = {
            severity: 'error',
            key: 'global-toast',
            life: 2000,
            closable: true,
            detail: '',
        };
        if (this.isValidUrl(this.href)) {
            this.urlData.data.value[0].href = this.href;
            this.href = '';
        } else {
            message.detail = 'Please enter a valid URL.';
            this.messageService.add(message);
            return;
        }
    }

    public onRemoveUrlPress() {
        this.urlData.data.value[0].href = '';
    }

    public onMouseUp(event: any) {
        const height = event.layerY;
        this.settings = { urlComponent: { iframeHeight: height } };
        this.urlData.settings = this.settings;
    }

    public isValidUrl(url: string) {
        const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

        if (regexp.test(url)) {
            return true;
        } else {
            return false;
        }
    }
}

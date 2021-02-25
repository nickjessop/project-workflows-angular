import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { ComponentSettings, createComponentMetadataTemplate, Embed } from '../../interfaces/core-component';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-embed',
    templateUrl: './embed.component.html',
    styleUrls: ['./embed.component.scss'],
})
export class EmbedComponent extends BaseFieldComponent implements OnInit {
    @Input() group!: FormGroup;

    public embedData = createComponentMetadataTemplate('embed') as Embed;
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
        this.embedData = this.field.metadata as Embed;

        this.cleanUrl = this.domSantizer.bypassSecurityTrustResourceUrl(this.embedData.data.value[0].href || '');

        try {
            if (this.embedData.data.value[0].href) {
                this.domain = new URL(this.embedData.data.value[0].href);
            }
        } catch (e) {
            this.domain.hostname = '';
        }

        this.settings = this.embedData.settings;
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
            this.embedData.data.value[0].href = this.href;
            this.href = '';
        } else {
            message.detail = 'Please enter a valid URL.';
            this.messageService.add(message);
            return;
        }
    }

    public onRemoveUrlPress() {
        this.embedData.data.value[0].href = '';
    }

    public onMouseUp(embed: any) {
        const height = embed.getBoundingClientRect().height;
        this.settings = { embedComponent: { iframeHeight: height } };
        this.embedData.settings = this.settings;
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

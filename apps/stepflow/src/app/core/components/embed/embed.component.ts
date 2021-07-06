import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import { MenuItem, MessageService } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import {
    BlockConfig,
    ComponentMode,
    ComponentSettings,
    createBlockConfig,
    createComponentMetadataTemplate,
    Embed,
} from '../../interfaces/core-component';

@Component({
    selector: 'app-embed',
    templateUrl: './embed.component.html',
    styleUrls: ['./embed.component.scss'],
})
export class EmbedComponent implements OnInit {
    @Input() group!: FormGroup;
    @Input() index = 0;
    @Input() field: BlockConfig = createBlockConfig('textInput');
    @Input() resizable?: boolean;
    @Input() componentMode?: ComponentMode;

    @ViewChild('iframe')
    public iframe!: ElementRef;

    public embedData = createComponentMetadataTemplate('embed') as Embed;
    public cleanUrl: SafeResourceUrl = '';
    public href: string = '';
    public domain: { hostname: string } = { hostname: '' };

    constructor(
        public projectService: ProjectService,
        private domSantizer: DomSanitizer,
        private messageService: MessageService
    ) {}

    private getBlockDrag() {
        this.projectService.isDragging.subscribe((dragging: boolean) => {
            if (this.iframe.nativeElement) {
                if (dragging === true) {
                    this.iframe.nativeElement.src = '';
                } else {
                    this.iframe.nativeElement.src = this.cleanUrl;
                }
            }
        });
    }

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
    }

    ngAfterViewInit() {
        this.getBlockDrag();
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
            this.projectService.syncProject();
        } else {
            message.detail = 'Please enter a valid URL.';
            this.messageService.add(message);
            return;
        }
    }

    public onRemoveUrlPress() {
        this.embedData.data.value[0].href = '';
        this.projectService.syncProject();
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

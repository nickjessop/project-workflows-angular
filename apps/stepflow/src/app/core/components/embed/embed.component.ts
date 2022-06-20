import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BlockConfig, ComponentMode, ComponentSettings, Embed } from '@stepflow/interfaces';
import { MenuItem, MessageService } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { CoreComponentService } from '../../core-component.service';

@Component({
    selector: 'app-embed',
    templateUrl: './embed.component.html',
    styleUrls: ['./embed.component.scss'],
})
export class EmbedComponent implements OnInit {
    @Input() group!: FormGroup;
    @Input() index = 0;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('embed');
    @Input() resizable = true;

    @ViewChild('iframe') iframe!: ElementRef;

    public embedData = this.coreComponentService.createComponentMetadataTemplate('embed') as Embed;
    public cleanUrl: SafeResourceUrl = '';
    public href = '';
    public domain: { hostname: string } = { hostname: '' };
    public settings?: ComponentSettings;
    public componentMode: ComponentMode = 'view';

    public items: MenuItem[] = [
        {
            label: 'Delete Block',
            icon: 'pi pi-times',
            command: () => {
                this.onDeleteBlock();
            },
        },
    ];

    constructor(
        public projectService: ProjectService,
        private domSantizer: DomSanitizer,
        private messageService: MessageService,
        private coreComponentService: CoreComponentService
    ) {}

    ngOnInit(): void {
        this.embedData = this.field.metadata as Embed;

        this.cleanUrl = this.domSantizer.bypassSecurityTrustResourceUrl(this.embedData.data.value[0].href || '');

        const isResizable = this.componentMode === 'edit';

        this.resizable = isResizable;

        try {
            if (this.embedData.data.value[0].href) {
                this.domain = new URL(this.embedData.data.value[0].href);
            }
        } catch (e) {
            this.domain.hostname = '';
        }
    }

    ngAfterViewInit() {
        // this.getBlockDrag();
    }

    public setComponentMode($event: ComponentMode) {
        this.componentMode = $event;
    }

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
        const regexp =
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

        if (regexp.test(url)) {
            return true;
        } else {
            return false;
        }
    }
}

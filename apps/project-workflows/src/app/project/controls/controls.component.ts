import { Component, Input, OnInit } from '@angular/core';
import { ComponentType } from '@project-workflows/interfaces';
import { MessageService } from 'primeng/api';
import { CoreComponentService } from '../../core/core-component.service';
import { ProjectService } from '../../services/project/project.service';
@Component({
    selector: 'step-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
    public isAddBlockDisabled = false;
    @Input() isDisabled = false;
    @Input()
    canConfigureProject: boolean = false;

    constructor(
        public projectService: ProjectService,
        private coreComponentService: CoreComponentService,
        private messageService: MessageService
    ) {}

    ngOnInit() {}

    public onSelectNewBlock(blockType: ComponentType) {
        this.addNewBlock(blockType);
    }

    public async addNewBlock(metadata: ComponentType, label?: string, name?: string) {
        const newBlock = this.coreComponentService.createBlockConfig(metadata, label, name);

        const res = await this.projectService.addProjectBlock(newBlock);

        if (res == null) {
            this.messageService.add({
                key: 'global-toast',
                severity: 'error',
                detail: 'You may only have a total of 150 blocks per a project on your plan.',
            });
        } else if (!res) {
            this.messageService.add({
                key: 'global-toast',
                severity: 'error',
                detail: 'Failed to add new block. Please try again.',
            });
        }
    }
}

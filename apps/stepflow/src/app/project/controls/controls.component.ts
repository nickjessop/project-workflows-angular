import { Component, Input, OnInit } from '@angular/core';
import { ComponentType } from '@stepflow/interfaces';
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

    constructor(public projectService: ProjectService, private coreComponentService: CoreComponentService) {}

    ngOnInit() {}

    public onSelectNewBlock(blockType: ComponentType) {
        this.addNewBlock(blockType);
    }

    public addNewBlock(metadata: ComponentType, label?: string, name?: string) {
        const newBlock = this.coreComponentService.createBlockConfig(metadata, label, name);

        this.projectService.addProjectBlock(newBlock);
    }
}

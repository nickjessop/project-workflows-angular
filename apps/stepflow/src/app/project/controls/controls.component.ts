import { Component } from '@angular/core';
import { ComponentType, createBlockConfig } from '../../core/interfaces/core-component';
import { ProjectService } from '../../services/project/project.service';
@Component({
    selector: 'step-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent {
    constructor(private projectService: ProjectService) {}

    public onSelectNewBlock(blockType: ComponentType) {
        this.addNewBlock(blockType);
    }

    public addNewBlock(metadata: ComponentType, label?: string, name?: string) {
        const newBlock = createBlockConfig(metadata, label, name);

        this.projectService.addProjectBlock(newBlock);
    }
}

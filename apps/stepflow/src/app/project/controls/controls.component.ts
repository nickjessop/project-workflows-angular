import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComponentType, createBlockConfig } from '../../core/interfaces/core-component';
import { StepConfig } from '../../models/interfaces/project';
import { ProjectService } from '../../services/project/project.service';
@Component({
    selector: 'step-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
    private currentStep?: StepConfig;
    private subscriptions = new Subscription();

    constructor(private projectService: ProjectService) {}

    ngOnInit(): void {
        this.initCurrentStep();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private initCurrentStep() {
        this.subscriptions.add(
            this.projectService.projectConfig$.subscribe(project => {
                project?.configuration?.forEach(stepConfig => {
                    if (stepConfig.step.isCurrentStep) {
                        this.currentStep = stepConfig;
                        return;
                    }
                });
            })
        );
    }

    public onSelectNewBlock(blockType: ComponentType) {
        console.log(`adding new block: ${blockType}`);
        // const componentMetadata = createComponentMetadataTemplate(blockType);
        this.addNewBlock(blockType);
    }

    public addNewBlock(metadata: ComponentType, label?: string, name?: string) {
        const newBlock = createBlockConfig(metadata, label, name);

        this.projectService.addProjectBlock(newBlock);
    }
}

import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
    ComponentMetadata,
    ComponentType,
    createBlockConfig,
    createComponentMetadataTemplate,
} from 'src/app/core/interfaces/core-component';
import { StepConfig } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';

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
                project.configuration?.forEach(stepConfig => {
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
        const componentMetadata = createComponentMetadataTemplate(blockType);

        if (componentMetadata) {
            this.addNewBlock(componentMetadata);
        } else {
            console.log('Missing component metadata for block');
        }
    }

    public addNewBlock(metadata: ComponentMetadata, label?: string, name?: string) {
        const newBlock = createBlockConfig(label, name, metadata);

        this.projectService.addProjectBlock(newBlock);
    }
}

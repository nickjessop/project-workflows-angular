import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComponentType, createFieldConfig } from 'src/app/models/interfaces/core-component';
import { StepConfig } from 'src/app/models/interfaces/project';
import { ProjectService } from 'src/app/services/project/project.service';

@Component({
    selector: 'project-controls',
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
            this.projectService.currentStep$.subscribe(_currentStep => {
                if (_currentStep) {
                    this.currentStep = _currentStep;
                }
            })
        );
    }

    public addNewBlock(
        label?: string,
        name?: string,
        inputType?: string,
        options?: string[],
        collections?: string,
        value?: string,
        type?: ComponentType
    ) {
        const componentType = type || 'largeTextInput';
        const newBlock = createFieldConfig(label, name, inputType, options, collections, componentType, value);

        if (this.currentStep?.components) {
            this.currentStep.components.push(newBlock);
            this.projectService.currentStep = this.currentStep;
        }
    }
}

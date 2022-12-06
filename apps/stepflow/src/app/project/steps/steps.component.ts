import { animate, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { Project, Status, Step, StepConfig } from '@stepflow/interfaces';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectService } from '../../services/project/project.service';
@Component({
    selector: 'project-steps',
    templateUrl: './steps.component.html',
    styleUrls: ['./steps.component.scss'],
    animations: [
        trigger('fade', [transition('void => *', [style({ opacity: 0 }), animate(1200, style({ opacity: 1 }))])]),
    ],
})
export class StepsComponent implements OnInit {
    private subscriptions = new Subscription();

    @ViewChild('scrollable', { static: true }) _scrollable!: ElementRef;
    @ViewChildren('stepLoop') _stepLoop!: QueryList<Step>;

    public project?: Project;
    public steps: StepConfig[] = [];
    public currentStep?: StepConfig;
    public doesExceed30ProjectSteps = false;

    @Output() dragAndDropStepEvent: EventEmitter<{
        previousIndex: number;
        currentIndex: number;
    }> = new EventEmitter();

    @Input()
    canConfigureProject: boolean = false;

    scrollSubject = new Subject<void>();
    scrollSubject$ = this.scrollSubject.asObservable();

    public showDialog = false;
    public stepMode: 'edit' | 'new' | 'delete' = 'edit';
    public focusStep: Step = {
        title: '',
        description: '',
        status: { label: 'No status', value: 'no-status', icon: '' },
    };
    statusOptions: Status[];

    public scrollPosition: number = 0;
    public hasHorizontalScroll: boolean = false;

    constructor(public projectService: ProjectService, private messageService: MessageService) {
        this.statusOptions = [
            { label: 'No status', value: 'no-status', icon: '' },
            { label: 'In progress', value: 'in-progress', icon: 'pi-step-inprogress' },
            { label: 'Needs review', value: 'needs-review', icon: 'pi-step-important' },
            { label: 'Upcoming', value: 'upcoming', icon: 'pi-step-upcoming' },
            { label: 'Completed', value: 'completed', icon: 'pi-step-completed' },
        ];
    }

    ngOnInit() {
        this.initializeProject();
        fromEvent(this._scrollable.nativeElement, 'scroll')
            .pipe(takeUntil(this.scrollSubject$))
            .subscribe((e: any) => this.scrollSteps(e));
    }

    scrollSteps(e: { target: Element }) {
        this.scrollPosition = (e.target as Element).scrollLeft;
    }

    scrollStepsRight() {
        this._scrollable.nativeElement.scrollLeft = this.scrollPosition + 60;
    }

    scrollStepsLeft() {
        this._scrollable.nativeElement.scrollLeft = this.scrollPosition - 60;
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.scrollSubject.next();
    }

    ngAfterViewInit() {
        this._stepLoop.changes.subscribe(() => {
            this.hasHorizontalScroll =
                this._scrollable.nativeElement.scrollWidth > this._scrollable.nativeElement.clientWidth;
        });
    }

    private initializeProject() {
        this.subscriptions.add(
            this.projectService.projectConfig$.subscribe(_project => {
                if (_project) {
                    this.project = _project;

                    if (_project.configuration) {
                        this.doesExceed30ProjectSteps = _project.configuration.length >= 30;
                        this.steps = _project.configuration;
                        this.currentStep = _project.configuration[0];
                    }
                }
            })
        );
    }

    public onStepPress(stepIndex: number) {
        this.projectService.setNewCurrentProjectStep(stepIndex);
    }

    public onAddNewStepPress() {
        this.openDialog('new');
    }

    public onEditCurrentStep() {
        const currentStep = this.projectService.getCurrentStep();

        this.openDialog('edit', currentStep);
    }

    private onDeleteCurrentStep() {
        const currentStep = this.projectService.getCurrentStep();

        this.openDialog('delete', currentStep);
    }

    public openDialog(stepMode: 'edit' | 'new' | 'delete', step?: Step) {
        if (stepMode === 'edit' && step) {
            this.focusStep = _.cloneDeep(step);
            this.stepMode = 'edit';
            this.showDialog = true;
        } else if (stepMode === 'new') {
            this.focusStep = {
                description: '',
                title: '',
                status: { label: 'No status', value: 'no-status', icon: '' },
            };
            this.stepMode = 'new';
            this.showDialog = true;
        } else if (stepMode == 'delete' && step) {
            this.focusStep = _.cloneDeep(step);
            this.stepMode = 'delete';
            this.showDialog = true;
        }
    }

    public onDialogSubmitEvent($event: { step?: Step; mode: 'edit' | 'new' | 'delete' }) {
        this.showDialog = false;

        const mode = $event.mode;
        if (mode === 'edit') {
            if ($event.step) {
                this.projectService.updateProjectStep($event.step);
            }
        } else if (mode === 'new') {
            if ($event.step) {
                const newStep = this.projectService.createNewProjectStep();

                if (!newStep) {
                    this.messageService.add({
                        key: 'global-toast',
                        severity: 'error',
                        detail: 'You may only create a max of 30 steps',
                    });

                    return;
                }

                newStep.step = $event.step;
                this.projectService.addProjectStep(newStep);
            }
        } else if (mode === 'delete') {
            this.projectService.deleteCurrentProjectStep();
        }
    }

    drop(event: CdkDragDrop<any>) {
        this.dragAndDropStepEvent.emit({
            previousIndex: event.previousIndex,
            currentIndex: event.currentIndex,
        });
    }

    public onHideEvent($event: true) {
        this.showDialog = false;
    }
}

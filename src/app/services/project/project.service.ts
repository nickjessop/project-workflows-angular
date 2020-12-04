import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, from, Subject } from 'rxjs';
import { ComponentType, createFieldConfig, FieldConfig } from '../../models/interfaces/core-component';
import { Project, Status, StepConfig } from '../../models/interfaces/project';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly PROJECT_COLLECTION_NAME = 'projects';
  private _projectConfig: BehaviorSubject<Project> = new BehaviorSubject<Project>(this.createBaseProject());
  public readonly projectConfig$ = this._projectConfig.asObservable();

  public unsubscribeToProjectListener?: () => void;

  constructor(private firebaseService: FirebaseService, private authenticationService: AuthenticationService) {}

  public get projectConfig() {
    return this._projectConfig.getValue();
  }

  public set projectConfig(project: Project) {
    this._projectConfig.next(project);
  }

  private setProject(project: Project) {
    const projectCopy1 = _.cloneDeep(this.projectConfig);
    const projectCopy2 = _.cloneDeep(project);

    const didProjectChange = this.areProjectsDifferent(projectCopy1, projectCopy2);

    if (didProjectChange) {
      console.log('project change detected');
      this.updateProject(project);
    }

    this.projectConfig = project;
  }

  private areProjectsDifferent(project1: Project, project2: Project) {
    // Drop values we shouldn't save or compare
    project1.configuration?.forEach(config => {
      config.step.isCurrentStep = false;
    });
    project2.configuration?.forEach(config => {
      config.step.isCurrentStep = false;
    });

    // Did the number of steps change?
    // Did the number of blocks change?
    // Did the steps or blocks get modified?

    const project1Len = project1.configuration?.length || 0;
    const project2Len = project2.configuration?.length || 0;

    if (project1Len !== project2Len) {
      return true;
    }

    for (let i = 0; i < (project1.configuration || []).length; i++) {
      const config1 = project1.configuration?.[i].components;
      const config2 = project2.configuration?.[i].components;

      if (!config2 || !config1) {
        return true;
      }

      if (config2.length !== config1.length) {
        return true;
      }

      if (JSON.stringify(config1) !== JSON.stringify(config2)) {
        return true;
      }
    }

    return false;
  }

  ngOnDestroy() {
    if (this.unsubscribeToProjectListener) {
      console.log('unsubscribing to project listener');
      this.unsubscribeToProjectListener();
    }
  }

  public createBaseProject(
    creatorId: string = this.authenticationService.user!.id,
    projectName = '',
    description = '',
    configuration?: StepConfig[]
  ) {
    const config: StepConfig[] = configuration
      ? configuration
      : [
          {
            components: [createFieldConfig()],
            step: {
              title: '(Untitled Step)',
              description: '(Untitled Step Description)',
              status: { label: 'Active', value: 'active', icon: 'pi-circle-off' },
              isCurrentStep: true,
            },
          },
        ];

    const baseProject: Project = {
      name: projectName,
      description,
      ownerIds: [creatorId],
      configuration: config,
    };

    return baseProject;
  }

  public swapBlockOrder(previousIndex: number, currentIndex: number) {
    // moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
    const currentStepIndex =
      this.projectConfig.configuration?.findIndex(config => {
        return config.step.isCurrentStep;
      }) || 0;

    const _projectConfig = _.cloneDeep(this.projectConfig);

    moveItemInArray(_projectConfig.configuration![currentStepIndex].components!, previousIndex, currentIndex);
    // this.projectConfig = _projectConfig;
    this.setProject(_projectConfig);
  }

  public createNewProjectStep(
    stepTitle?: string,
    stepDescription?: string,
    status?: Status,
    label?: string,
    name?: string,
    inputType?: string,
    options?: string[],
    collections?: string,
    type?: ComponentType,
    value?: string
  ) {
    const fieldConfig = createFieldConfig(label, name, inputType, options, collections, type, value);

    const stepConfig: StepConfig = {
      step: {
        title: stepTitle || '(Untitled Step)',
        description: stepDescription || '',
        status: status || { label: 'Active', value: 'active', icon: 'pi-circle-off' },
      },
      components: [fieldConfig],
    };

    return stepConfig;
  }

  public createNewProject(projectName?: string, projectDescription?: string) {
    const baseProject = this.createBaseProject(this.authenticationService.user!.id, projectName, projectDescription);

    return this.firebaseService
      .getDbInstance()!
      .collection(this.PROJECT_COLLECTION_NAME)
      .add(baseProject)
      .then(
        documentRef => {
          baseProject.id = documentRef.id;
          documentRef.update({ id: documentRef.id });
          // this.projectConfig = baseProject;
          return baseProject;
        },
        error => {
          console.log(`Error occurred while creating a new project: ${error}`);
        }
      );
  }

  //TODO: Add firebase rule to check that users are authorized to edit this project
  public updateProject(projectConfig: Project) {
    return this.firebaseService
      .getDbInstance()!
      .collection(this.PROJECT_COLLECTION_NAME)
      .doc(projectConfig.id)
      .set(projectConfig, { merge: true })
      .then(
        () => {
          console.log(`Successfully updated project`);
          return true;
        },
        error => {
          console.log(`An error occurred while updating project: ${error}`);
          return false;
        }
      );
  }

  public deleteProject(projectId: string) {
    return this.firebaseService
      .getDbInstance()!
      .collection(this.PROJECT_COLLECTION_NAME)
      .doc(projectId)
      .delete()
      .then(
        success => {
          return true;
        },
        error => {
          return false;
        }
      );
  }

  public getAllProjectIds() {
    return from(
      this.firebaseService
        .getDbInstance()
        .collection(`${this.PROJECT_COLLECTION_NAME}`)
        .get()
    );
  }

  public addProjectBlock(projectBlock: FieldConfig) {
    const currentStepIndex = this.getCurrentStepIndex() || 0;

    const _projectConfig = _.cloneDeep(this.projectConfig);
    _projectConfig.configuration![currentStepIndex].components?.push(projectBlock);

    // this.projectConfig = _projectConfig;
    this.setProject(_projectConfig);
  }

  public addProjectStep(newStep: StepConfig) {
    const _projectConfig = _.cloneDeep(this.projectConfig);
    _projectConfig.configuration?.push(newStep);

    this.setNewCurrentProjectStep(
      _projectConfig.configuration ? _projectConfig.configuration.length - 1 : 0,
      _projectConfig
    );
  }

  private getCurrentStepIndex() {
    const currentStepIndex = this.projectConfig.configuration?.findIndex(config => {
      return config.step.isCurrentStep;
    });

    return currentStepIndex;
  }

  private resetCurrentProjectSteps(projectConfig: Project) {
    const _projectConfig = _.cloneDeep(projectConfig);
    _projectConfig.configuration?.forEach(stepConfig => {
      if (stepConfig.step.isCurrentStep) {
        stepConfig.step.isCurrentStep = false;
      }
    });

    return _projectConfig;
  }

  public setNewCurrentProjectStep(stepIndex: number, projectConfig?: Project) {
    const _projectConfig = projectConfig
      ? this.resetCurrentProjectSteps(projectConfig)
      : this.resetCurrentProjectSteps(_.cloneDeep(this.projectConfig));

    if (_projectConfig.configuration?.[stepIndex]) {
      _projectConfig.configuration[stepIndex].step.isCurrentStep = true;
    } else {
      _projectConfig.configuration![0].step.isCurrentStep = true;
    }

    this.setProject(_projectConfig);
  }

  //TODO: Add firebase rule to only return authorized projects
  public getProjects(userId: string) {
    const creatorsProjects$ = new Subject();
    const membersProjects$ = new Subject();

    const creatorProjectsRef = this.firebaseService
      .getDbInstance()!
      .collection(this.PROJECT_COLLECTION_NAME)
      .where('creatorId', '==', userId);

    const memberProjectsRef = this.firebaseService
      .getDbInstance()!
      .collection(this.PROJECT_COLLECTION_NAME)
      .where('memberIds', 'array-contains', userId);

    creatorProjectsRef.onSnapshot(creatorsProjectsSnapshot => {
      const data = creatorsProjectsSnapshot.docs.map(d => d.data());
      return creatorsProjects$.next(data);
    });

    memberProjectsRef.onSnapshot(membersProjectsSnapshot => {
      const data = membersProjectsSnapshot.docs.map(d => d.data());
      return membersProjects$.next(data);
    });

    const allProjectsForUser$ = combineLatest(creatorsProjects$, membersProjects$).pipe(values => {
      return values;
    });

    return allProjectsForUser$;
  }

  public subscribeAndSetProject(projectId: string) {
    console.log(`Subscribing to project: ${projectId}`);

    this.unsubscribeToProjectListener = this.firebaseService
      .getDbInstance()!
      .collection(this.PROJECT_COLLECTION_NAME)
      .doc(projectId)
      .onSnapshot(
        document => {
          const project = document.data() as Project;
          console.log('change', project);
          const currentStepSet = project.configuration?.some(stepConfig => {
            return stepConfig.step.isCurrentStep;
          });

          if (!currentStepSet) {
            if (project.configuration?.[0].step) {
              project.configuration[0].step.isCurrentStep = true;
            }
          }

          this.projectConfig = project;
        },
        error => {
          console.log(error);
        }
      );
  }

  // public saveDemoProject() {
  //     const demoConfig = this.generateDemoProjectConfig();
  //     const demoConfigs = [demoConfig, demoConfig, demoConfig, demoConfig];

  //     const projectConfig: Project = this.createBaseProject(
  //         this.authenticationService.user!.id,
  //         'Testing Project',
  //         demoConfigs
  //     );

  //     const project = this.createNewProject().then(newProject => {
  //         projectConfig.id = newProject.id;
  //         this.updateProject(projectConfig);
  //     });
  // }

  // private generateDemoProjectConfig() {
  //     const defaultConfig: FieldConfig[] = [
  //         {
  //             type: 'smallTextInput',
  //             label: 'Title',
  //             inputType: 'text',
  //             name: '',
  //             value: 'TTC Management System',
  //         },
  //         {
  //             type: 'largeTextInput',
  //             label: 'Introduction Summary',
  //             inputType: 'text',
  //             name: '',
  //             value:
  //                 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ' +
  //                 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
  //                 'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure ' +
  //                 'dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
  //                 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  //         },
  //         {
  //             type: 'smallTextInput',
  //             label: 'Cost Summary',
  //             inputType: 'text',
  //             name: '',
  //             value: 'Additional $56,656 cost for travel allowance around GTA.',
  //         },
  //     ];

  // const stepConfig: StepConfig = {
  //         components: defaultConfig,
  //         step: {
  //             title: 'Insert title here',
  //             description: 'This is just a test step',
  //             status: { label: 'Active', icon: 'pi-circle-off' },
  //             isCurrentStep: true,
  //         },
  //     };

  //     return stepConfig;
  // }
}

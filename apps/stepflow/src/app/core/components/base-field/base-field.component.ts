import { Component, Input } from '@angular/core';
import { BlockConfig } from '@stepflow/interfaces';
import { ProjectService } from '../../../services/project/project.service';
import { CoreComponentService } from '../../core-component.service';

@Component({
    selector: 'app-base-field',
    templateUrl: './base-field.component.html',
    styleUrls: ['./base-field.component.scss'],
})
export class BaseFieldComponent {
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('textInput');
    @Input() index?: number;

    constructor(public projectService: ProjectService, private coreComponentService: CoreComponentService) {}
}

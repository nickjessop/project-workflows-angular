import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentMode } from 'src/app/models/interfaces/core-component';
import { ProjectService } from 'src/app/services/project/project.service';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent extends BaseFieldComponent implements OnInit {
    // @Input() field: FieldConfig = createFieldConfig();
    @Input() group!: FormGroup;
    @Input() componentMode: ComponentMode = 'view';
    // @Input() index = 0;

    tableData = [
        {
            name: 'Project coordination',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            hours: '40',
            price: '3200',
        },
        {
            name: 'Webpage design',
            description:
                'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            hours: '120',
            price: '9600',
        },
        {
            name: 'Branding',
            description: 'Et harum quidem rerum facilis est et expedita distinctio.',
            hours: '40',
            price: '3200',
        },
        {
            name: 'Development',
            description:
                'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.',
            hours: '240',
            price: '19,000',
        },
        {
            name: 'Server Configuration',
            description:
                'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.',
            hours: '20',
            price: '1600',
        },
    ];
    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {}
}

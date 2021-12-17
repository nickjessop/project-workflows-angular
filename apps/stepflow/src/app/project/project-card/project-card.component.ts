import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
    @Input() projectName = '';
    @Input() openedDate = '';
    @Input() projectDescription = '';
    @Input() link = '';
    @Input() projectId = '';
    @Input() projectOwner: boolean = false;

    @Output() onDeleteProjectByIdEvent = new EventEmitter<{ id: string }>();

    constructor(private router: Router) {}

    ngOnInit() {}

    navigate() {
        this.router.navigateByUrl(this.link);
    }

    public projectMenuOptions: MenuItem[] = [
        {
            label: 'Delete Project',
            icon: 'pi pi-trash',
            command: () => {
                this.onDeleteProjectPress();
            },
        },
    ];

    onDeleteProjectPress() {
        this.onDeleteProjectByIdEvent.emit({ id: this.projectId });
    }
}

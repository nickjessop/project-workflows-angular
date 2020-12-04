import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

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

    @Output() onDeleteProjectByIdEvent = new EventEmitter<{ id: string }>();

    constructor(private router: Router) {}

    ngOnInit() {}

    navigate() {
        this.router.navigateByUrl(this.link);
    }

    onDeleteProjectPress() {
        this.onDeleteProjectByIdEvent.emit({ id: this.projectId });
    }
}

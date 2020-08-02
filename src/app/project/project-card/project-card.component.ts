import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
    @Input() projectName = '';
    @Input() openedDate = '';
    @Input() projectDescription = '';
    @Input() link = '';

    constructor(private router: Router) {}

    ngOnInit() {}

    navigate() {
        this.router.navigateByUrl(this.link);
    }
}

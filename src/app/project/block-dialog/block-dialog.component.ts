import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'project-block-dialog',
    templateUrl: './block-dialog.component.html',
    styleUrls: ['./block-dialog.component.scss'],
})
export class BlockDialogComponent implements OnInit {
    @Input() showDialog = false;
    constructor() {}

    ngOnInit(): void {}
}

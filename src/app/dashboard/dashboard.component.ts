import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase/firebase.service';
import { FieldConfig } from '../models/interfaces/core-component';
import { Validators } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}

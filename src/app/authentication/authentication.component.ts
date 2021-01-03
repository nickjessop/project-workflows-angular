import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase/firebase.service';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
    constructor(private firebaseService: FirebaseService) {}

    ngOnInit(): void {}
}

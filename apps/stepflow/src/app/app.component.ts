import * as amplitude from '@amplitude/analytics-browser';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    ngOnInit() {
        amplitude.init('d1a266158419b9a148a8c701cf97eff0');
    }
    title = 'Stepflow';
}

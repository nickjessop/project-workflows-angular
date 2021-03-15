import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'apps/stepflow/src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private API_URL = environment.apiUrl;

    constructor(private http: HttpClient) {}

    public testApi() {
        return this.http.get(this.API_URL);
    }
}

import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'apps/stepflow/src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService implements HttpInterceptor {
    private API_URL = environment.apiUrl;

    constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.authenticationService.getCurrentUser()?.getIdToken() || '').pipe(
            switchMap(token => {
                if (token.length > 0) {
                    const reqClone = req.clone({ headers: req.headers.append('Authorization', token) });
                    return next.handle(reqClone);
                } else {
                    return next.handle(req);
                }
            })
        );
    }

    public testApi() {
        return this.http.get(`${this.API_URL}project`);
    }

    public get(path: string) {}

    public post() {}

    public put() {}

    public delete() {}

    public patch() {}
}

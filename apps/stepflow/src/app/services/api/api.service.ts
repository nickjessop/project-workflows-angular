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

    public get(path: string, id?: string) {
        const _url = id ? `${path}/${id}` : path;

        return this.http.get(_url);
    }

    public post(path: string, payload?: any) {
        return this.http.post(path, payload);
    }

    public put(path: string, payload?: any) {
        return this.http.put(path, payload);
    }

    public delete(path: string, id?: string) {
        const _url = id ? `${path}/${id}` : path;
        return this.http.delete(_url);
    }

    public testApi() {
        return this.post(`${this.API_URL}user`, { test: 'asdf' });
    }
}

import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'apps/stepflow/src/environments/environment';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
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
        const _url = id ? `${this.API_URL}/${path}/${id}` : `${this.API_URL}/${path}`;

        return lastValueFrom(this.http.get(_url));
    }

    public post(path: string, payload?: any) {
        return lastValueFrom(this.http.post(`${this.API_URL}/${path}`, payload));
    }

    public put(path: string, payload?: any) {
        return lastValueFrom(this.http.put(`${this.API_URL}/${path}`, payload));
    }

    public delete(path: string, id?: string) {
        const _url = id ? `${this.API_URL}/${path}/${id}` : `${this.API_URL}/${path}`;
        return lastValueFrom(this.http.delete(_url));
    }
}

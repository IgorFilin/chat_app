import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private apiUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get<T, R>(
    path: string,
    params?: T,
    api: string = this.apiUrl
  ): Observable<R> {
    const httpParams = new HttpParams();
    if (params) {
      for (const key in params) {
        httpParams.set(key, params[key] as string);
      }
    }

    return this.http.get<R>(`${api}/${path}`, {
      params: httpParams,
      withCredentials: true,
    });
  }

  post<T, R>(path: string, body: T, api: string = this.apiUrl): Observable<R> {
    return this.http.post<R>(`${api}/${path}`, body, {
      withCredentials: true,
    });
  }
}

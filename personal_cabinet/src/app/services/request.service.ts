import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private apiUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get(
    path: string,
    params: Record<string, string> = {},
    api: string = this.apiUrl
  ): Observable<any> {
    return this.http.get(`${api}/${path}`, {
      params,
      withCredentials: true,
    });
  }

  post(
    path: string,
    body: Record<string, string>,
    api: string = this.apiUrl
  ): Observable<any> {
    return this.http.post(`${api}/${path}`, body, {
      withCredentials: true,
    });
  }
}

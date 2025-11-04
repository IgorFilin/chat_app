import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IApiResponse, ILoginUserPayload } from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginRepository {
  private readonly httpClient = inject(HttpClient);

  login(loginUserPayload: ILoginUserPayload): Observable<IApiResponse> {
    return this.httpClient.post<IApiResponse>('gateway/login', loginUserPayload, {
      withCredentials: true,
    });
  }
}

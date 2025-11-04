import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IApiResponse, ILoginResponse, ILoginUserPayload, ILoginUserPayloadByDevice } from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginRepository {
  private readonly httpClient = inject(HttpClient);

  login(loginUserPayload: ILoginUserPayloadByDevice): Observable<IApiResponse<ILoginResponse>> {
    return this.httpClient.post<IApiResponse<ILoginResponse>>('gateway/login', loginUserPayload, {
      withCredentials: true,
    });
  }
}

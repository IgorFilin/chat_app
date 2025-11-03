import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IApiResponse, IRegUserPayload } from '../../shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationRepository {
  private readonly httpClient = inject(HttpClient);

  registration(regUserPayload: IRegUserPayload): Observable<IApiResponse> {
    return this.httpClient.post<IApiResponse>('gateway/registration', regUserPayload);
  }
}

import { Injectable } from '@angular/core';
import { RegistrationRepository } from '../../infrastructure/repositories/registration.repository';
import { IRegUserPayload } from '../../shared/models';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationUseCase {
  constructor(private readonly registrationRepository: RegistrationRepository) {}

  execute(userPayload: IRegUserPayload) {
    return this.registrationRepository.registration(userPayload).pipe(
      switchMap(({ success }) => {
        if (success) {
          return of(true);
        } else return of(false);
      })
    );
  }
}

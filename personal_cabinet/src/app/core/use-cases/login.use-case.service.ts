import { Injectable } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { LoginRepository } from '../../infrastructure/repositories/login.repository';
import { ILoginUserPayload } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class LoginUseCase {
  constructor(private readonly loginRepository: LoginRepository) {}

  execute(userPayload: ILoginUserPayload) {
    return this.loginRepository.login(userPayload).pipe(
      switchMap(({ success }) => {
        if (success) {
          return of(true);
        } else return of(false);
      })
    );
  }
}

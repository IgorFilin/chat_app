import { Injectable } from '@angular/core';
import { of, switchMap, tap } from 'rxjs';
import { ILoginUserPayload, ILoginUserPayloadByDevice } from '../../shared/models';
import { AuthService } from '../../services/auth.service';
import { DeviceService } from '../../services/device.service';
import { AuthRepository } from '../../infrastructure/repositories/auth.repository';

@Injectable({
  providedIn: 'root',
})
export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authService: AuthService,
    private readonly deviceService: DeviceService
  ) {}

  execute(userPayload: ILoginUserPayload) {
    const deviceId = this.deviceService.getUUIDDevice() || '';

    const userPayloadByDevice: ILoginUserPayloadByDevice = {
      ...userPayload,
      deviceId,
    };
    return this.authRepository.login(userPayloadByDevice).pipe(
      tap((response) => {
        const { data, success } = response;
        if (data) {
          this.authService.setAuthAndNavigateMainPage({
            accessToken: data.accessToken,
            isAuth: success,
          });
        }
      })
    );
  }
}

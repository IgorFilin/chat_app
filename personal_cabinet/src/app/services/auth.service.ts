import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { catchError, map, of } from 'rxjs';
import { UtilsService } from './utils.servise';
import { ToasterService } from './toaster.service';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';

export interface AuthType {
  isAuth: boolean;
  isLoading: boolean;
}

interface GetAuthPesponseType {
  isAuth: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuth: boolean = false;

  constructor(
    private requestService: RequestService,
    private utilsService: UtilsService,
    private toastService: ToasterService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  getAuth() {
    this.loadingService.startLoading();
    this.requestService
      .get('user/auth')
      .pipe(
        map((data: GetAuthPesponseType) => {
          this.toastService.success('Вы успешно авторизованы');
          this.router.navigateByUrl('/');
          this.isAuth = data.isAuth;
          this.loadingService.stopLoading();
        }),
        catchError((error) => {
          // const errorMessage = error.error.message;
          this.loadingService.stopLoading();
          // this.toastService.error('errorMessage');
          return of();
        })
      )
      .subscribe();
  }
}

import { DestroyRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { IArticle, IArticleResponse } from '../models/interfaces';
import { IEditArtickeBody } from '../models/request';
import { RequestService } from './request.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToasterService } from './toaster.service';
import { Observable, tap } from 'rxjs';
import { TechnologyStackType } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {

  dataArticles: WritableSignal<IArticle[]> = signal([]);
  destroyRef = inject(DestroyRef)
  constructor(
    private requestService: RequestService,
    private toastService: ToasterService,
  ) { }
  
  get articles() {
    return this.dataArticles()
  }
  
  set articles(articles:Array<IArticle>) {
    this.dataArticles.set(articles)
  }

  
  createArticle(payload: any): Observable<any> {
    return this.requestService
    .post<any,any>('learning/create-article', { ...payload })
    .pipe(
      tap((data) => {
        if (data.message) {
          this.toastService.info(data.message);
        }
      })
    );
  }

  getTag(filter:string){
    return this.requestService
    .get<any,any>('learning/tags', { filter })
    .pipe(
      tap((data) => {
        if (data.message) {
          this.toastService.info(data.message);
        }
      })
    );
  }

  getArticles(filter?: TechnologyStackType): Observable<any> {
    return this.requestService
    .get<any,any>('learning/articles', { filter : filter ?? '' })
    .pipe(
      tap((data) => {
        if (data.message) {
          this.toastService.info(data.message);
        }
      })
    );
  }

  getArticle(id: string): Observable<any> {
    return this.requestService
    .get<any, IArticleResponse>('learning/article', { id })
  }

  editArticle(body: IEditArtickeBody): void {
    // this.loadingService.startLoading();
    this.requestService
      .post<IEditArtickeBody, any>('user/login', body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (data) => {
          // this.toastService.success(data.message);
          console.log('data response', data);
        },
        (error) => {
          const errorMessage = error.error.message || 'К сожалению произошла ошибка';
          this.toastService.error(errorMessage);
        }
      );
  }
}

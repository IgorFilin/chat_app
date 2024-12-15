import { Injectable, signal, WritableSignal } from '@angular/core';
import { IArticle } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {

  dataArticles: WritableSignal<IArticle[]> = signal([]);
  
  constructor() { }
  
  get articles() {
    return this.dataArticles()
  }
  
  set articles(articles:Array<IArticle>) {
    this.dataArticles.set(articles)
  }
}

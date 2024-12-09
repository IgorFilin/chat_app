import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {

  dataArticles: WritableSignal<any> = signal([]);
  
  constructor() { }
  
  get articles() {
    return this.dataArticles()
  }
  
  set articles(articles:Array<any>) {
    this.dataArticles.set(articles)
  }
}

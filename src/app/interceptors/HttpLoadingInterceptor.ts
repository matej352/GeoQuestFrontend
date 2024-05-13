import {
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { LoadingDialogService } from '../services/loading-service/loading-dialog.service';

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  constructor(private loadingDialogService: LoadingDialogService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.endsWith('SaveAnswer')) {
      return next.handle(request);
    }
    this.loadingDialogService.openDialog();
    return next.handle(request).pipe(
      //delay(1000),                    //slow network simulated 1 sec
      finalize(() => {
        this.loadingDialogService.hideDialog();
      })
    ) as Observable<HttpEvent<any>>;
  }
}

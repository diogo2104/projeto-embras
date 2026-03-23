import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppMessageService } from '../services/message.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messages = inject(AppMessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiErrors = error.error?.errors;
      const detail = Array.isArray(apiErrors)
        ? apiErrors.join(' | ')
        : error.error?.message || 'Não foi possível concluir a operação.';

      if (error.status !== 0) {
        messages.error('Erro na requisição', detail);
      }

      return throwError(() => error);
    })
  );
};

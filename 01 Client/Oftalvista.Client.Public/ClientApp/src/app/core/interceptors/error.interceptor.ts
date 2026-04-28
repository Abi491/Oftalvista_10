import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const s = inject(MatSnackBar);
  return next(req).pipe(
    catchError((e) => {
      const m = e?.error?.message || e?.message || 'Error inesperado';
      s.open(m, 'Cerrar', { duration: 5000, panelClass: ['snack-error'] });
      return throwError(() => e);
    }),
  );
};

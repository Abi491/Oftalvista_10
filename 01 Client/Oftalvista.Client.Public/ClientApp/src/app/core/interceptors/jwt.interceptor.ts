import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const t = inject(AuthService).getToken();
  if (t) req = req.clone({ setHeaders: { Authorization: `Bearer ${t}` } });
  return next(req);
};

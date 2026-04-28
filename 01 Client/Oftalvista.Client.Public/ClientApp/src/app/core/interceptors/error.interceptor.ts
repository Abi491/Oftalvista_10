import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router  = inject(Router);
  const snack   = inject(MatSnackBar);
  const auth    = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) { auth.logout(); router.navigate(["/login"]); }
      const msg = err.error?.message || err.message || "Error en el servidor";
      snack.open(msg, "Cerrar", { duration: 4000, panelClass: ["snack-error"] });
      return throwError(() => err);
    })
  );
};

import { inject } from "@angular/core";
import { CanActivateFn, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const roles: number[] = route.data["roles"] ?? [];
  if (!roles.length || roles.includes(auth.getRol())) return true;
  router.navigate(["/login"]);
  return false;
};

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Guard de rutas que permite el acceso solo a usuarios autenticados.
 *
 * Verifica si el usuario está autenticado mediante el `AuthService`.
 * Si no lo está, le redirige a la ruta `/login`.
 *
 * @param route - Información de la ruta que se intenta activar (actualmente no se utiliza).
 * @param state - Estado del router al momento de la navegación (actualmente no se utiliza).
 * @returns `true` si el usuario está autenticado, de lo contrario `false` y redirige al login.
 */
export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const authService = inject(AuthService);

	return authService.isAuthenticated().pipe(
		map((isAuthenticated) => {
			if (isAuthenticated) {
				return true;
			} else {
				router.navigate(['/login']);
				return false;
			}
		}),
	);
};

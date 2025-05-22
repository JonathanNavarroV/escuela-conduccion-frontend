import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Guard de rutas que redirige al usuario al dashboard si ya está autenticado.
 *
 * Se utiliza en rutas públicas como `/login` para evitar que usuarios autenticados accedan nuevamente a la pantalla de inicio de sesión.
 *
 * @param route - Información de la ruta que se intenta activar (actualmente no se utiliza).
 * @param state - Estado del router al momento de la navegación (actualmente no se utiliza).
 * @returns `false` y redirige a `/admin` si el usuario ya está autenticado, `true` si no lo está.
 */
export const guestGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const authService = inject(AuthService);

	return authService.isAuthenticated().pipe(
		map((isAuthenticated) => {
			if (isAuthenticated) {
				router.navigate(['/admin']);
				return false;
			} else {
				return true;
			}
		}),
	);

	return true;
};

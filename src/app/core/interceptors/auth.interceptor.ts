import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor HTTP que agrega el token JWT a las cabeceras de autorización de las solicitudes salientes.
 *
 * Si el token está disponible a través del `AuthService`, clona la solicitud original y
 * le añade una cabecera `Authorization` con el esquema Bearer.
 *
 * @param req - La solicitud HTTP original.
 * @param next - El siguiente manejador en la cadena de interceptores.
 * @returns Un observable con la solicitud original o modificada.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const token = authService.getToken();

	if (token) {
		const cloned = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
		return next(cloned);
	}

	return next(req);
};

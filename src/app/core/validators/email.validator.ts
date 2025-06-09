import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Valida que el valor de un control sea un correo electrónico con formato estricto.
 *
 * Se asegura de que el correo:
 * - No tenga espacios.
 * - Tenga exactamente un símbolo `@`.
 * - Termine con un dominio que tenga al menos dos caracteres después del punto final.
 *
 * @param {AbstractControl} control - El control de formulario que contiene el valor a validar.
 * @returns {ValidationErrors | null} Un objeto con la clave `strictEmail` si la validación falla, o `null` si es válido.
 */
export function strictEmailValidator(
	control: AbstractControl,
): ValidationErrors | null {
	const email = control.value;

	if (!email) return null;

	const strictEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

	return strictEmailRegex.test(email) ? null : { strictEmail: true };
}

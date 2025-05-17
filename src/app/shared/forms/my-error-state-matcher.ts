import { Injectable } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Injectable({
	providedIn: 'root',
})
export class MyErrorStateMatcher implements ErrorStateMatcher {
	/**
	 * Determina si un control de formulario se encuentra en estado error.
	 *
	 * Esta función evalúa si el control es inválido y si ha sido tocado, modificado o si el formulario ha sido enviado.
	 *
	 * @param control - Control del formulario que se está evaluando (puede ser `null`).
	 * @param form - Formulario que contiene el control, puede ser `FormGroupDirective` o un `NgForm` (puede ser null)
	 * @returns `true` si el control está en estado de error, de lo contrario, `false`
	 */
	isErrorState(
		control: FormControl | null, // Control de formulario que se está evaluando
		form: FormGroupDirective | NgForm | null, // Formulario que contiene el control
	): boolean {
		// Se verifica si el formulario ha sido enviado
		const isSubmitted = form && form.submitted;

		/**
		 * Se retorna true si el control tiene un error y cumple con alguna de las condiciones de interacción
		 * - El control tiene errores de validación
		 * - El control ha sido tocado o modificado
		 * - El formulario ha sido enviado
		 *  */
		return !!(
			control && // Se asegura que exista el control
			control.invalid && // Se verifica si el control tiene errores de validación
			(control.dirty || control.touched || isSubmitted) // Se verifica si el control ha sido tocado, modificado o si el formulario ya ha sido enviado
		);
	}
}

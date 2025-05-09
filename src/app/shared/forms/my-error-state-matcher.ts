import { Injectable } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Injectable({
	providedIn: 'root',
})
export class MyErrorStateMatcher implements ErrorStateMatcher {
	// Se determina si el control del formulario está en estado de error
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

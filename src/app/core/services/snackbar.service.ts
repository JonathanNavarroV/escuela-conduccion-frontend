import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class SnackbarService {
	private snackBar = inject(MatSnackBar);

	/**
	 * Muestra un mensaje breve en la parte inferior de la pantalla usando Angular Material Snackbar.
	 *
	 * @param message - El mensaje de texto que se mostrará en el snackbar.
	 * @param action - El texto del botón de acción (opcional, por defecto es "Cerrar").
	 */
	public show(message: string, action: string = 'Cerrar') {
		const config: MatSnackBarConfig = {
			duration: environment.snackbarDuration,
			horizontalPosition: 'center',
			verticalPosition: 'bottom',
		};

		this.snackBar.open(message, action, config);
	}
}

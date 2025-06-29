import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmDialogData } from '../../../core/models/common/confirm-dialog-data';

@Component({
	selector: 'app-confirm-action-dialog',
	standalone: true,
	imports: [MatDialogModule, MatButtonModule],
	templateUrl: './confirm-action-dialog.component.html',
	styleUrl: './confirm-action-dialog.component.scss',
})
export class ConfirmActionDialogComponent {
	/** Referencia al diálogo actual del componente de confirmación. */
	private readonly dialogRef = inject(
		MatDialogRef<ConfirmActionDialogComponent>,
	);
	/** Datos inyectados al diálogo de confirmación. */
	protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

	/**
	 * Cierra el diálogo confirmando la acción con un valor `true`.
	 */
	protected onConfirmClick(): void {
		this.dialogRef.close(true);
	}
}

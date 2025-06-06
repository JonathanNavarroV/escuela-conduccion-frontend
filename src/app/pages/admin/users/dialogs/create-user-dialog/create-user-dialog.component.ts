import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../../../../../core/models/common/api-response.model';
import { UserService } from '../../../../../core/services/user.service';

@Component({
	selector: 'app-create-user-dialog',
	standalone: true,
	imports: [
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		FormsModule,
		NgFor,
	],
	templateUrl: './create-user-dialog.component.html',
	styleUrl: './create-user-dialog.component.scss',
})
export class CreateUserDialogComponent {
	constructor(private readonly userService: UserService) {}

	roles?: Array<string>;
	selectedRole?: string;

	ngOnInit(): void {
		this.loadRoles();
	}

	/**
	 * Carga la lista de roles disponibles desde el servicio y la asigna a la propiedad local.
	 *
	 * @returns {Promise<void>} Promesa que se resuelve cuando los roles han sido cargados y asignados.
	 */
	async loadRoles(): Promise<void> {
		const apiResponse: ApiResponse<Array<string>> = await firstValueFrom(
			this.userService.getRoles(),
		);

		this.roles = apiResponse.data;
	}
}

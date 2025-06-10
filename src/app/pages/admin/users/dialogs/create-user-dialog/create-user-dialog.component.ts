import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';
import { Branch } from '../../../../../core/models/branches/branch.model';
import { ApiResponse } from '../../../../../core/models/common/api-response.model';
import { CreateUserDto } from '../../../../../core/models/users/user-dto.model';
import { BranchService } from '../../../../../core/services/branch.service';
import { UserService } from '../../../../../core/services/user.service';
import { strictEmailValidator } from '../../../../../core/validators/email.validator';

@Component({
	selector: 'app-create-user-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
	],
	templateUrl: './create-user-dialog.component.html',
	styleUrl: './create-user-dialog.component.scss',
})
export class CreateUserDialogComponent implements OnInit {
	private readonly formBuilder = inject(FormBuilder);
	private readonly userService = inject(UserService);
	private readonly branchService = inject(BranchService);
	private readonly dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);

	createUserForm: FormGroup;

	constructor() {
		this.createUserForm = this.formBuilder.group({
			firstName: ['', [Validators.required]],
			lastNameFather: ['', [Validators.required]],
			lastNameMother: ['', [Validators.required]],
			email: ['', [Validators.required, strictEmailValidator]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			photo: ['', []],
			role: ['', [Validators.required]],
			branchIds: ['', [Validators.required]],
		});
	}

	roles?: string[];
	branches?: Branch[];

	/**
	 * Carga inicialmente todos los roles.
	 */
	ngOnInit(): void {
		this.loadRoles();
		this.loadBranches();
	}

	/**
	 * Carga la lista de roles disponibles desde el servicio y la asigna a la propiedad local.
	 */
	async loadRoles(): Promise<void> {
		const apiResponse: ApiResponse<string[]> = await firstValueFrom(
			this.userService.getRoles(),
		);

		this.roles = apiResponse.data;
	}

	/**
	 * Carga la lista de sedes disponibles desde el servicio y la asigna a la propiedad local.
	 */
	async loadBranches(): Promise<void> {
		const apiResponse: ApiResponse<Branch[]> = await firstValueFrom(
			this.branchService.getBranches(),
		);

		this.branches = apiResponse.data;
	}

	/**
	 * Maneja el envío del formulario de creación de usuario.
	 *
	 * - Valida todos los controles del formulario.
	 * - Si el formulario es inválido, marca todos los campos como "tocados" para mostrar errores.
	 * - Si es válido, construye un `CreateUserDto` con los datos ingresados.
	 * - Elimina el valor de `photo` si viene vacío (lo convierte a `undefined` para que pase la validación del backend).
	 * - Cierra el diálogo y retorna el DTO al componente padre.
	 */
	onSubmit(): void {
		// Mostrar errores de controles
		if (this.createUserForm.invalid) {
			this.createUserForm.markAllAsTouched();
			return;
		}

		const formValue = this.createUserForm.value;

		const userToCreate: CreateUserDto = {
			firstName: formValue.firstName,
			lastNameFather: formValue.lastNameFather,
			lastNameMother: formValue.lastNameMother,
			email: formValue.email,
			password: formValue.password,
			photo: formValue.photo?.trim() || undefined,
			role: formValue.role,
			branchIds: formValue.branchIds,
		};

		this.dialogRef.close(userToCreate);
	}
}

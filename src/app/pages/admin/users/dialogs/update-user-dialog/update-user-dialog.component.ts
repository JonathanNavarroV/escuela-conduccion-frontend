import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';
import { Branch } from '../../../../../core/models/branches/branch.model';
import { ApiResponse } from '../../../../../core/models/common/api-response.model';
import { UpdateUserDto } from '../../../../../core/models/users/user-dto.model';
import { User } from '../../../../../core/models/users/user.model';
import { BranchService } from '../../../../../core/services/branch.service';
import { UserService } from '../../../../../core/services/user.service';
import { strictEmailValidator } from '../../../../../core/validators/email.validator';

@Component({
	selector: 'app-update-user-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatButtonModule,
	],
	templateUrl: './update-user-dialog.component.html',
	styleUrl: './update-user-dialog.component.scss',
})
export class UpdateUserDialogComponent implements OnInit {
	private readonly formBuilder = inject(FormBuilder);
	private readonly userService = inject(UserService);
	private readonly branchService = inject(BranchService);
	private readonly dialogRef = inject(MatDialogRef<UpdateUserDialogComponent>);
	private readonly userId = inject<string>(MAT_DIALOG_DATA);

	protected updateUserForm: FormGroup;
	protected roles?: string[];
	protected branches?: Branch[];

	public constructor() {
		this.updateUserForm = this.formBuilder.group({
			firstName: [''],
			lastNameFather: [''],
			lastNameMother: [''],
			email: ['', [strictEmailValidator]],
			password: ['', [Validators.minLength(6)]],
			photo: [''],
			role: [{ value: '', disabled: true }],
			branchIds: ['', [Validators.required]],
		});
	}

	public ngOnInit(): void {
		this.loadRoles();
		this.loadBranches();
		this.loadUser();
		this.setBranchValidation();
	}

	/**
	 * Carga la lista de roles disponibles desde el servicio y la asigna a la propiedad local.
	 */
	private async loadRoles(): Promise<void> {
		const apiResponse: ApiResponse<string[]> = await firstValueFrom(
			this.userService.getRoles(),
		);

		this.roles = apiResponse.data;
	}

	/**
	 * Carga la lista de sedes disponibles desde el servicio y la asigna a la propiedad local.
	 */
	private async loadBranches(): Promise<void> {
		const apiResponse: ApiResponse<Branch[]> = await firstValueFrom(
			this.branchService.getBranches(),
		);

		this.branches = apiResponse.data;
	}

	/**
	 * Carga el usuario desde el servicio
	 */
	private async loadUser(): Promise<void> {
		const apiResponse: ApiResponse<User> = await firstValueFrom(
			this.userService.getUserById(this.userId),
		);

		const user = apiResponse.data;

		this.updateUserForm.patchValue({
			firstName: user.firstName,
			lastNameFather: user.lastNameFather,
			lastNameMother: user.lastNameMother,
			email: user.email,
			photo: user.photo,
			role: user.role,
			branchIds: user.branchIds,
		});
	}

	private setBranchValidation(): void {
		const branchControl = this.updateUserForm.get('branchIds');

		if (this.isBranchAdmin) {
			branchControl?.setValidators([Validators.required]);
		} else {
			branchControl?.clearValidators();
			branchControl?.setValue([]);
		}

		branchControl?.updateValueAndValidity();
	}

	/**
	 * Retorna `true` si el rol actual seleccionado en el formulario es `branch_admin`.
	 * Útil para condiciones en plantillas y validaciones reactivas.
	 */
	protected get isBranchAdmin(): boolean {
		return this.updateUserForm.get('role')?.value === 'branch_admin';
	}

	/**
	 * Maneja el envío del formulario de actualización de usuario.
	 *
	 * - Valida todos los controles del formulario.
	 * - Si el formulario es inválido, marca todos los campos como "tocados" para mostrar errores.
	 * - Si es válido, construye un `UpdateUserDto` con los datos ingresados.
	 * - Elimina `password` y `photo` si vienen vacíos (los convierte a `undefined` para evitar sobrescribir datos en el backend).
	 * - Cierra el diálogo y retorna el DTO al componente padre.
	 */
	protected onSubmit(): void {
		// Mostrar errores de controles
		if (this.updateUserForm.invalid) {
			this.updateUserForm.markAllAsTouched();
			return;
		}

		const formValue = this.updateUserForm.value;

		const userToUpdate: UpdateUserDto = {
			firstName: formValue.firstName,
			lastNameFather: formValue.lastNameFather,
			lastNameMother: formValue.lastNameMother,
			email: formValue.email,
			photo: formValue.photo,
			branchIds: formValue.branchIds,
		};

		if (formValue.password?.trim()) {
			userToUpdate.password = formValue.password.trim();
		}

		if (!formValue.photo?.trim()) {
			userToUpdate.photo = null;
		}

		this.dialogRef.close(userToUpdate);
	}
}

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
		MatInputModule,
		MatSelectModule,
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
	/** Identificador del usuario recibido como dato en el diálogo (MAT_DIALOG_DATA). */
	private readonly userId = inject<string>(MAT_DIALOG_DATA);

	protected updateUserForm: FormGroup;
	protected roles?: string[];
	protected branches?: Branch[];

	public constructor() {
		this.updateUserForm = this.formBuilder.group({
			firstName: ['', [Validators.required, Validators.maxLength(100)]],
			lastNameFather: ['', [Validators.required, Validators.maxLength(50)]],
			lastNameMother: ['', [Validators.required, Validators.maxLength(50)]],
			email: [
				'',
				[Validators.required, Validators.maxLength(255), strictEmailValidator],
			],
			password: ['', [Validators.maxLength(255), Validators.minLength(6)]],
			photo: [''],
			role: [{ value: '', disabled: true }],
			branchIds: ['', [Validators.required]],
		});
	}

	/**
	 * Inicializa el componente cargando roles, sedes y datos del usuario.
	 *
	 * Descripción detallada:
	 * - Llama a `loadRoles()` para obtener los roles disponibles.
	 * - Llama a `loadBranches()` para obtener las sedes disponibles.
	 * - Llama a `loadUser()` para cargar los datos del usuario actual o seleccionado.
	 */
	public ngOnInit(): void {
		this.loadRoles();
		this.loadBranches();
		this.loadUser();
	}

	/**
	 * Carga la lista de roles disponibles desde el backend.
	 *
	 * Descripción detallada:
	 * - Realiza una llamada al servicio para obtener los roles.
	 * - Asigna los roles recibidos a la propiedad `roles`.
	 *
	 * @returns {Promise<void>} No retorna valor; finaliza al completar la carga de roles.
	 *
	 * @async
	 */
	private async loadRoles(): Promise<void> {
		const apiResponse: ApiResponse<string[]> = await firstValueFrom(
			this.userService.getRoles(),
		);

		this.roles = apiResponse.data;
	}

	/**
	 * Carga la lista de sedes disponibles desde el backend.
	 *
	 * Descripción detallada:
	 * - Realiza una llamada al servicio para obtener las sedes.
	 * - Asigna las sedes recibidas a la propiedad `branches`.
	 *
	 * @returns {Promise<void>} No retorna valor; finaliza al completar la carga de sedes.
	 *
	 * @async
	 */
	private async loadBranches(): Promise<void> {
		const apiResponse: ApiResponse<Branch[]> = await firstValueFrom(
			this.branchService.getBranches(),
		);

		this.branches = apiResponse.data;
	}

	/**
	 * Carga los datos de un usuario específico desde el backend y actualiza el formulario.
	 *
	 * Descripción detallada:
	 * - Obtiene la información del usuario usando el `userId` actual.
	 * - Actualiza los valores del formulario `updateUserForm` con los datos recibidos.
	 * - Configura la validación del campo de sedes llamando a `setBranchValidation()`.
	 *
	 * @returns {Promise<void>} Promesa que se resuelve cuando los datos se cargan y el formulario se actualiza.
	 *
	 * @async
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

		this.setBranchValidation();
	}

	/**
	 * Configura la validación del campo `branchIds` en el formulario de actualización de usuario.
	 *
	 * Descripción detallada:
	 * - Si el rol es administrador de sede (`isBranchAdmin`), establece el campo como obligatorio.
	 * - Si no, elimina las validaciones y limpia el valor del campo.
	 * - Actualiza el estado y validez del campo tras aplicar los cambios.
	 */
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
	 * Indica si el rol seleccionado en el formulario de actualización es administrador de sede.
	 *
	 * Descripción detallada:
	 * - Verifica si el valor del campo `role` en el formulario `updateUserForm` es `'branch_admin'`.
	 *
	 * @returns {boolean} `true` si el rol es `branch_admin`, `false` en caso contrario.
	 */
	protected get isBranchAdmin(): boolean {
		return this.updateUserForm.get('role')?.value === 'branch_admin';
	}

	/**
	 * Procesa el envío del formulario para actualizar un usuario existente.
	 *
	 * Descripción detallada:
	 * - Valida el formulario y marca todos los controles como tocados si hay errores para mostrarlos.
	 * - Construye un objeto `UpdateUserDto` con los valores del formulario.
	 * - Incluye la contraseña solo si fue ingresada y no está vacía.
	 * - Si la foto está vacía o solo espacios, la asigna como `null`.
	 * - Cierra el diálogo enviando el objeto actualizado como resultado.
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

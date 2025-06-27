import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
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
		MatInputModule,
		MatSelectModule,
		MatButtonModule,
	],
	templateUrl: './create-user-dialog.component.html',
	styleUrl: './create-user-dialog.component.scss',
})
export class CreateUserDialogComponent implements OnInit {
	private readonly formBuilder = inject(FormBuilder);
	private readonly userService = inject(UserService);
	private readonly branchService = inject(BranchService);
	private readonly dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);

	protected createUserForm: FormGroup;
	protected roles?: string[];
	protected branches?: Branch[];

	public constructor() {
		this.createUserForm = this.formBuilder.group({
			firstName: ['', [Validators.required]],
			lastNameFather: ['', [Validators.required]],
			lastNameMother: ['', [Validators.required]],
			email: ['', [Validators.required, strictEmailValidator]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			photo: [''],
			role: ['', [Validators.required]],
			branchIds: ['', [Validators.required]],
		});
	}

	/**
	 * Inicializa el componente cargando datos y configurando validaciones.
	 *
	 * Descripción detallada:
	 * - Carga la lista de roles disponibles mediante `loadRoles()`.
	 * - Carga la lista de sedes mediante `loadBranches()`.
	 * - Configura validaciones dependientes del rol mediante `setupRoleDepedentValidation()`.
	 */
	public ngOnInit(): void {
		this.loadRoles();
		this.loadBranches();
		this.setupRoleDepedentValidation();
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
	 * Configura validaciones dinámicas en el formulario según el rol seleccionado.
	 *
	 * Descripción detallada:
	 * - Escucha cambios en el campo `role` del formulario `createUserForm`.
	 * - Si el rol es de tipo administrador de sede (`isBranchAdmin`), establece el campo `branchIds` como obligatorio.
	 * - Si no, elimina las validaciones y limpia el valor de `branchIds`.
	 * - Actualiza el estado y validez del campo después de aplicar cambios.
	 */
	private setupRoleDepedentValidation(): void {
		this.createUserForm.get('role')?.valueChanges.subscribe(() => {
			const branchControl = this.createUserForm.get('branchIds');

			if (this.isBranchAdmin) {
				branchControl?.setValidators([Validators.required]);
			} else {
				branchControl?.clearValidators();
				branchControl?.setValue([]);
			}

			branchControl?.updateValueAndValidity();
		});
	}

	/**
	 * Indica si el rol seleccionado es administrador de sede.
	 *
	 * Descripción detallada:
	 * - Verifica si el valor del campo `role` en el formulario `createUserForm` es `'branch_admin'`.
	 *
	 * @returns {boolean} `true` si el rol es `branch_admin`, `false` en caso contrario.
	 */
	protected get isBranchAdmin(): boolean {
		return this.createUserForm.get('role')?.value === 'branch_admin';
	}

	/**
	 * Procesa el envío del formulario para crear un nuevo usuario.
	 *
	 * Descripción detallada:
	 * - Valida el formulario y marca todos los controles como tocados si hay errores para mostrarlos.
	 * - Construye un objeto `CreateUserDto` con los valores del formulario.
	 * - Cierra el diálogo enviando el objeto creado como resultado.
	 */
	protected onSubmit(): void {
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

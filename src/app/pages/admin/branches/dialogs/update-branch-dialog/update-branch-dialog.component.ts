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
import { UpdateBranchDto } from '../../../../../core/models/branches/branch-dto.model';
import { Branch } from '../../../../../core/models/branches/branch.model';
import { ApiResponse } from '../../../../../core/models/common/api-response.model';
import { District } from '../../../../../core/models/locations/district.model';
import { LocationLevel } from '../../../../../core/models/locations/location-level.model';
import { Province } from '../../../../../core/models/locations/province.model';
import { Region } from '../../../../../core/models/locations/region.model';
import { BranchService } from '../../../../../core/services/branch.service';
import { LocationsService } from '../../../../../core/services/locations.service';
import { strictEmailValidator } from '../../../../../core/validators/email.validator';

@Component({
	selector: 'app-update-branch-dialog',
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
	templateUrl: './update-branch-dialog.component.html',
	styleUrl: './update-branch-dialog.component.scss',
})
export class UpdateBranchDialogComponent implements OnInit {
	private readonly formBuilder = inject(FormBuilder);
	private readonly locationService = inject(LocationsService);
	private readonly branchService = inject(BranchService);
	private readonly dialogRef = inject(
		MatDialogRef<UpdateBranchDialogComponent>,
	);
	/** Identificador de la sede recibida como dato en el diálogo (MAT_DIALOG_DATA). */
	private readonly branchId = inject<string>(MAT_DIALOG_DATA);

	protected updateBranchForm: FormGroup;
	protected regionLevel?: LocationLevel;
	protected provinceLevel?: LocationLevel;
	protected districtLevel?: LocationLevel;
	protected regionLabel?: string;
	protected provinceLabel?: string;
	protected districtLabel?: string;
	protected regions?: Region[];
	protected provinces?: Province[];
	protected districts?: District[];

	public constructor() {
		this.updateBranchForm = this.formBuilder.group({
			name: ['', [Validators.required, Validators.maxLength(100)]],
			email: [
				'',
				[Validators.required, Validators.maxLength(255), strictEmailValidator],
			],
			phone: ['', [Validators.required, Validators.maxLength(30)]],
			mobile: ['', [Validators.required, Validators.maxLength(30)]],
			address: ['', [Validators.required, Validators.maxLength(255)]],
			region: ['', [Validators.required]],
			province: ['', [Validators.required]],
			district: ['', [Validators.required]],
		});
	}

	/**
	 * Ciclo de vida de inicialización del componente.
	 *
	 * Descripción detallada:
	 * - Configura los campos de localización dinámicamente según los niveles disponibles.
	 * - Llama a `loadBranch()` para cargar los datos de la sede actual o seleccionado.
	 * - Establece los listeners para reaccionar a cambios en región y provincia.
	 */
	public ngOnInit(): void {
		this.configureLocationField();
		this.loadBranch();
		this.setupRegionListener();
		this.setupProvinceListener();
	}

	/**
	 * Configura dinámicamente los campos de ubicación del formulario de actualización de sede.
	 *
	 * Descripción detallada:
	 * - Carga los niveles de localización disponibles (región, provincia, distrito).
	 * - Asigna las etiquetas correspondientes a cada nivel según la respuesta del backend.
	 * - Si no existe nivel de región, se eliminan sus validadores del formulario.
	 *
	 * @returns {Promise<void>} Promesa que se resuelve al completar la configuración.
	 *
	 * @async
	 */
	private async configureLocationField(): Promise<void> {
		const locationLevels = await this.loadLocationLevels();

		const regionControl = this.updateBranchForm.get('region');

		this.regionLevel = locationLevels.find((l) => l.key === 'region');
		this.provinceLevel = locationLevels.find((l) => l.key === 'province');
		this.districtLevel = locationLevels.find((l) => l.key === 'district');

		this.regionLabel = this.regionLevel?.label_key;
		this.provinceLabel = this.provinceLevel?.label_key;
		this.districtLabel = this.districtLevel?.label_key;

		if (!this.regionLevel) {
			regionControl?.clearValidators();
		}
	}

	/**
	 * Carga los datos de una sede específica desde el backend y actualiza el formulario.
	 *
	 * Descripción detallada:
	 * - Obtiene la información completa de la sede utilizando el `branchId`.
	 * - Si hay niveles de localización definidos (región, provincia, distrito), se cargan según corresponda.
	 * - Actualiza los valores del formulario `updateBranchForm` con los datos recibidos.
	 *
	 * @returns {Promise<void>} Promesa que se resuelve al completar la carga y actualización del formulario.
	 *
	 * @async
	 */
	private async loadBranch(): Promise<void> {
		const apiResponse: ApiResponse<Branch> = await firstValueFrom(
			this.branchService.getBranchById(this.branchId),
		);

		const branch = apiResponse.data;

		if (branch.district.province?.region) {
			this.loadRegions();
			this.loadProvinces(branch.district.province?.region.id);
		} else {
			this.loadProvinces();
		}
		if (branch.district.province) {
			this.loadDistricts(branch.district.province.id);
		}

		this.updateBranchForm.patchValue({
			name: branch.name,
			email: branch.email,
			phone: branch.phone,
			mobile: branch.mobile,
			address: branch.address,
			region: branch.district.province?.region?.id ?? null,
			province: branch.district.province?.id,
			district: branch.district.id,
		});
	}

	/**
	 * Configura el listener del campo `region` para reaccionar a los cambios de valor.
	 *
	 * Descripción detallada:
	 * - Al seleccionar una región, carga las provincias correspondientes.
	 * - Reinicia y habilita los campos `province` y `district`.
	 */
	private setupRegionListener(): void {
		const regionControl = this.updateBranchForm.get('region');
		const provinceControl = this.updateBranchForm.get('province');
		const districtControl = this.updateBranchForm.get('district');

		regionControl?.valueChanges.subscribe((regionId) => {
			if (regionControl?.value) {
				this.loadProvinces(regionId);
				provinceControl?.reset();
				provinceControl?.enable();
				districtControl?.reset();
				districtControl?.enable();
			}
		});
	}

	/**
	 * Configura el listener del campo `province` para reaccionar a los cambios de valor.
	 *
	 * Descripción detallada:
	 * - Al seleccionar una provincia, carga los distritos correspondientes.
	 * - Reinicia y habilita el campo `district`.
	 */
	private setupProvinceListener(): void {
		const provinceControl = this.updateBranchForm.get('province');
		const districtControl = this.updateBranchForm.get('district');

		provinceControl?.valueChanges.subscribe((provinceId) => {
			if (provinceControl?.value) {
				this.loadDistricts(provinceId);
				districtControl?.reset();
				districtControl?.enable();
			}
		});
	}

	/**
	 * Carga la lista de regiones disponibles desde el backend.
	 *
	 * Descripción detallada:
	 * - Realiza una llamada al servicio para obtener las regiones.
	 * - Asigna las regiones recibidas a la propiedad `regions`.
	 *
	 * @returns {Promise<void>} No retorna valor; finaliza al completar la carga de regiones.
	 *
	 * @async
	 */
	private async loadRegions(): Promise<void> {
		const apiResponse: ApiResponse<Region[]> = await firstValueFrom(
			this.locationService.getRegions(),
		);

		this.regions = apiResponse.data;
	}

	/**
	 * Carga la lista de provincias desde el backend, filtradas por región si se especifica.
	 *
	 * Descripción detallada:
	 * - Si se proporciona un `regionId`, obtiene solo las provincias asociadas a esa región.
	 * - Si no, obtiene todas las provincias disponibles.
	 * - Asigna el resultado a la propiedad `provinces`.
	 *
	 * @param {string} [regionId] - ID de la región para filtrar las provincias (opcional).
	 * @returns {Promise<void>} Promesa que se resuelve al completar la carga.
	 *
	 * @async
	 */
	private async loadProvinces(
		regionId: string | undefined = undefined,
	): Promise<void> {
		let apiResponse: ApiResponse<Province[]>;

		if (regionId) {
			apiResponse = await firstValueFrom(
				this.locationService.getProvincesByRegionId(regionId),
			);
		} else {
			apiResponse = await firstValueFrom(this.locationService.getProvinces());
		}

		this.provinces = apiResponse.data;
	}

	/**
	 * Carga la lista de distritos asociados a una provincia específica.
	 *
	 * Descripción detallada:
	 * - Realiza una llamada al backend usando el `provinceId` para obtener los distritos correspondientes.
	 * - Asigna el resultado a la propiedad `districts`.
	 *
	 * @param {string} provinceId - ID de la provincia para filtrar los distritos.
	 * @returns {Promise<void>} Promesa que se resuelve al completar la carga.
	 *
	 * @async
	 */
	private async loadDistricts(provinceId: string): Promise<void> {
		const apiResponse: ApiResponse<District[]> = await firstValueFrom(
			this.locationService.getDistrictsByProvinceId(provinceId),
		);

		this.districts = apiResponse.data;
	}

	/**
	 * Carga los niveles de localización desde el backend.
	 *
	 * Descripción detallada:
	 * - Obtiene información sobre los niveles de ubicación (por ejemplo: región, provincia, distrito).
	 * - Devuelve la lista de niveles obtenidos.
	 *
	 * @returns {Promise<LocationLevel[]>} Lista de niveles de ubicación disponibles.
	 *
	 * @async
	 */
	private async loadLocationLevels(): Promise<LocationLevel[]> {
		const apiResponse: ApiResponse<LocationLevel[]> = await firstValueFrom(
			this.locationService.getLocationLevels(),
		);

		return apiResponse.data;
	}

	/**
	 * Procesa el envío del formulario para actualizar una sede existente.
	 *
	 * Descripción detallada:
	 * - Valida el formulario y marca todos los controles como tocados si hay errores.
	 * - Construye un objeto `UpdateBranchDto` con los datos ingresados.
	 * - Omite el campo `phone` si está vacío.
	 * - Cierra el diálogo enviando el objeto con los datos actualizados de la sede.
	 */
	protected onSubmit(): void {
		// Mostrar errores de controles
		if (this.updateBranchForm.invalid) {
			this.updateBranchForm.markAllAsTouched();
			return;
		}

		const formValue = this.updateBranchForm.value;

		const branchToUpdate: UpdateBranchDto = {
			name: formValue.name,
			email: formValue.email,
			phone: formValue.phone || undefined,
			mobile: formValue.mobile,
			address: formValue.address,
			districtId: formValue.district,
		};

		this.dialogRef.close(branchToUpdate);
	}
}

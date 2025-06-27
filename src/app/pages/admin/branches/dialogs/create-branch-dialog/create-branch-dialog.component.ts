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
import { CreateBranchDto } from '../../../../../core/models/branches/branch-dto.model';
import { ApiResponse } from '../../../../../core/models/common/api-response.model';
import { District } from '../../../../../core/models/locations/district.model';
import { LocationLevel } from '../../../../../core/models/locations/location-level.model';
import { Province } from '../../../../../core/models/locations/province.model';
import { Region } from '../../../../../core/models/locations/region.model';
import { LocationsService } from '../../../../../core/services/locations.service';
import { strictEmailValidator } from '../../../../../core/validators/email.validator';

@Component({
	selector: 'app-create-branch-dialog',
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
	templateUrl: './create-branch-dialog.component.html',
	styleUrl: './create-branch-dialog.component.scss',
})
export class CreateBranchDialogComponent implements OnInit {
	private readonly formBuilder = inject(FormBuilder);
	private readonly locationService = inject(LocationsService);
	private readonly dialogRef = inject(
		MatDialogRef<CreateBranchDialogComponent>,
	);

	protected createBranchForm: FormGroup;
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
		this.createBranchForm = this.formBuilder.group({
			name: ['', [Validators.required, Validators.maxLength(100)]],
			email: [
				'',
				[Validators.required, Validators.maxLength(255), strictEmailValidator],
			],
			phone: ['', [Validators.maxLength(30)]],
			mobile: ['', [Validators.required, Validators.maxLength(30)]],
			address: ['', [Validators.required, Validators.maxLength(255)]],
			region: [''],
			province: [{ value: '', disabled: true }],
			district: [{ value: '', disabled: true }],
		});
	}

	public ngOnInit(): void {
		this.configureLocationField();
		this.setupRegionListener();
		this.setupProvinceListener();
	}

	/**
	 * Configura dinámicamente los campos de ubicación del formulario de creación de sede.
	 *
	 * Descripción detallada:
	 * - Carga los niveles de localización (región, provincia, distrito).
	 * - Asigna las etiquetas correspondientes según el nivel.
	 * - Aplica validadores de requerimiento según los niveles existentes.
	 * - Carga regiones o provincias dependiendo del caso.
	 *
	 * @returns {Promise<void>} Promesa que se resuelve al completar la configuración.
	 *
	 * @async
	 */
	private async configureLocationField(): Promise<void> {
		const locationLevels = await this.loadLocationLevels();

		const regionControl = this.createBranchForm.get('region');
		const provinceControl = this.createBranchForm.get('province');

		this.regionLevel = locationLevels.find((l) => l.key === 'region');
		this.provinceLevel = locationLevels.find((l) => l.key === 'province');
		this.districtLevel = locationLevels.find((l) => l.key === 'district');

		this.regionLabel = this.regionLevel?.label_key;
		this.provinceLabel = this.provinceLevel?.label_key;
		this.districtLabel = this.districtLevel?.label_key;

		if (this.regionLevel) {
			regionControl?.setValidators([Validators.required]);
			this.loadRegions();
		}
		if (this.provinceLevel) {
			provinceControl?.setValidators([Validators.required]);
			if (!this.regionLevel) {
				this.loadProvinces();
				provinceControl?.enable();
			}
		}
	}

	/**
	 * Configura el listener del campo `region` para reaccionar a los cambios de valor.
	 *
	 * Descripción detallada:
	 * - Al seleccionar una región, carga las provincias correspondientes.
	 * - Reinicia y habilita el campo `province`.
	 */
	private setupRegionListener(): void {
		const regionControl = this.createBranchForm.get('region');
		const provinceControl = this.createBranchForm.get('province');

		regionControl?.valueChanges.subscribe((regionId) => {
			if (regionControl?.value) {
				this.loadProvinces(regionId);
				provinceControl?.reset();
				provinceControl?.enable();
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
		const provinceControl = this.createBranchForm.get('province');
		const districtControl = this.createBranchForm.get('district');

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
	 * Procesa el envío del formulario para crear una nueva sede.
	 *
	 * Descripción detallada:
	 * - Valida el formulario y marca todos los controles como tocados si hay errores.
	 * - Construye un objeto `CreateBranchDto` con los datos ingresados.
	 * - Omite el campo `phone` si está vacío.
	 * - Cierra el diálogo enviando el objeto con los datos de la nueva sede.
	 */
	protected onSubmit(): void {
		// Mostrar errores de controles
		if (this.createBranchForm.invalid) {
			this.createBranchForm.markAllAsTouched();
			return;
		}

		const formValue = this.createBranchForm.value;

		const branchToCreate: CreateBranchDto = {
			name: formValue.name,
			email: formValue.email,
			phone: formValue.phone || undefined,
			mobile: formValue.mobile,
			address: formValue.address,
			districtId: formValue.district,
		};

		this.dialogRef.close(branchToCreate);
	}
}

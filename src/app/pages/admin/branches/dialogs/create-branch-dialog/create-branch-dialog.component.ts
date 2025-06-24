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
			phone: ['', Validators.maxLength(30)],
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
	 * Configura dinámicamente los campos de ubicación (región, provincia, comuna)
	 * según los niveles definidos en el sistema.
	 *
	 * - Asigna los niveles detectados a propiedades locales (`regionLevel`, `provinceLevel`, `districtLevel`).
	 * - Establece las etiquetas (`label_key`) para los `mat-label` dinámicos.
	 * - Aplica validadores `required` según el nivel activo.
	 * - Carga regiones o provincias si corresponde.
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
	 * Escucha los cambios en el campo de región.
	 * Cuando el usuario selecciona una región, se cargan las provincias correspondientes
	 * y se habilita el campo de provincia.
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
	 * Escucha los cambios en el campo de provincia.
	 * Cuando el usuario selecciona una provincia, se cargan las comunas correspondientes
	 * y se habilita el campo de comuna.
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
	 * Carga la lista de regiones disponibles desde el servicio y la asigna a la propiedad local.
	 */
	private async loadRegions(): Promise<void> {
		const apiResponse: ApiResponse<Region[]> = await firstValueFrom(
			this.locationService.getRegions(),
		);

		this.regions = apiResponse.data;
	}

	/**
	 * Carga las provincias asociadas a una región específica.
	 *
	 * @param regionId ID de la región seleccionada.
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
	 * Carga las comunas (distritos) asociadas a una provincia específica.
	 *
	 * @param provinceId ID de la provincia seleccionada.
	 */
	private async loadDistricts(provinceId: string): Promise<void> {
		const apiResponse: ApiResponse<District[]> = await firstValueFrom(
			this.locationService.getDistrictsByProvinceId(provinceId),
		);

		this.districts = apiResponse.data;
	}

	/**
	 * Carga los niveles de localización configurados en el sistema (como región, provincia, distrito).
	 *
	 * @returns Lista de niveles de localización.
	 */
	private async loadLocationLevels(): Promise<LocationLevel[]> {
		const apiResponse: ApiResponse<LocationLevel[]> = await firstValueFrom(
			this.locationService.getLocationLevels(),
		);

		return apiResponse.data;
	}

	/**
	 * Maneja el envío del formulario de creación de sede.
	 *
	 * - Valida todos los controles del formulario.
	 * - Si el formulario es inválido, marca todos los campos como "tocados" para mostrar errores.
	 * - Si es válido, construye un `CreateBranchDto` con los datos ingresados.
	 * - Cierra el diálogo y retorna el DTO al componente padre.
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

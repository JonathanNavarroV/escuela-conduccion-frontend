import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';
import { Branch } from '../../../../../core/models/branches/branch.model';
import { ApiResponse } from '../../../../../core/models/common/api-response.model';
import { BranchService } from '../../../../../core/services/branch.service';
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
	constructor(
		private readonly userService: UserService,
		private readonly branchService: BranchService,
	) {}

	roles?: Array<string>;
	selectedRole?: string;

	branches?: Array<Branch>;
	selectedBranches?: Array<Branch>;

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
		const apiResponse: ApiResponse<Array<string>> = await firstValueFrom(
			this.userService.getRoles(),
		);

		this.roles = apiResponse.data;
	}

	async loadBranches(): Promise<void> {
		const apiResponse: ApiResponse<Array<Branch>> = await firstValueFrom(
			this.branchService.getBranches(),
		);

		this.branches = apiResponse.data;
	}
}

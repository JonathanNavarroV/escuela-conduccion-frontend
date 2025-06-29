export interface CreateBranchDto {
	name: string;
	email: string;
	phone: string | null;
	mobile: string;
	address: string;
	districtId: string;
}

export type UpdateBranchDto = CreateBranchDto;

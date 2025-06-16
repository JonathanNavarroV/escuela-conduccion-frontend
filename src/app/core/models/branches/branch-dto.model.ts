export interface CreateBranchDto {
	name: string;
	email: string;
	phone: string;
	mobile: string;
	address: string;
	district: string;
	city: string;
}

export type UpdateBranchDto = CreateBranchDto;

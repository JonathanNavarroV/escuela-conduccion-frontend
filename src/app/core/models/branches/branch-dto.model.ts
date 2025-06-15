export interface CreateBranchDto {
	name: string;
	email: string;
	phone: string;
	mobile: string;
	address: string;
	commune: string;
	city: string;
}

export type UpdateBranchDto = CreateBranchDto;

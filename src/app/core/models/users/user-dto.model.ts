export interface CreateUserDto {
	firstName: string;
	lastNameFather: string;
	lastNameMother: string;
	email: string;
	password: string;
	photo: string | null;
	role: string;
	branchIds: string[];
}

export interface UpdateUserDto extends Omit<CreateUserDto, 'role'> {
	role?: string;
}

export interface CreateUserDto {
	firstName: string;
	lastNameFather: string;
	lastNameMother: string;
	email: string;
	password: string;
	photo: string;
	role: string;
	branchIds: string[];
}

export interface UpdateUserDto
	extends Omit<CreateUserDto, 'password' | 'photo' | 'role'> {
	password?: string;
	photo?: string;
	role?: string;
}

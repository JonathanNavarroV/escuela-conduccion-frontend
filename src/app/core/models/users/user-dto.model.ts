export interface CreateUserDto {
	firstName: string;
	lastNameFather: string;
	lastNameMother: string;
	email: string;
	password: string;
	photo: string | null;
	role: string;
	branches: Array<string>;
}

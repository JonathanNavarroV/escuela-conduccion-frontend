export interface User {
	id: string;
	photo: string | null;
	firstName: string;
	lastNameFather: string;
	lastNameMother: string;
	email: string;
	role: string;
	branchIds: string[];
}

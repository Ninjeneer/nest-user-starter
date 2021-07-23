import { UserRole } from '../user.service';

export default class CreateUserDTO {
	email: string;
	password: string;
	role: UserRole;
}

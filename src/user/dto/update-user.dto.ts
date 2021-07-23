import { UserRole } from '../user.service';

export default class UpdateUserDTO {
	email: string;
	password: string;
	role: UserRole;
}

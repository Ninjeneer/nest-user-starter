import CreateUserDTO from './create-user.dto';
import { PartialType } from '@nestjs/swagger';

export default class UpdateUserDTO extends PartialType(CreateUserDTO) {}

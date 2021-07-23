import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import { Request } from 'express';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { TokenGuard } from '../guards/token.guard';
import { UserRole, UserService } from './user.service';
import { SelfGuard } from '../guards/self.guard';
import {
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger';
import CreateUserDTO from './dto/create-user.dto';
import UpdateUserDTO from './dto/update-user.dto';
import UserEntity from './entities/UserEntity';

@Controller('users')
@ApiTags('Users')
@UseGuards(TokenGuard, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@Roles(UserRole.ADMIN)
	@ApiBody({ type: CreateUserDTO })
	@ApiOperation({ summary: 'Create a user' })
	@ApiCreatedResponse({ description: 'User created successfully', type: UserEntity })
	@ApiConflictResponse({ description: 'User e-mail already exists' })
	async create(@Req() request: Request, @Body() createUserDto: CreateUserDTO) {
		const user = await this.userService.create({ ip: request.ip, ...createUserDto });
		delete user.password;
		return new UserEntity({ ...user });
	}

	@Get()
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Retrieve all users' })
	@ApiOkResponse({ description: 'Successfully retrieved user list', type: [UserEntity] })
	async findAll() {
		return (await this.userService.findAll()).map((user) => new UserEntity({ ...user }));
	}

	@Get(':id')
	@ApiOperation({ summary: 'Retrieve a user' })
	@ApiOkResponse({ description: 'Successfully retrieved user', type: UserEntity })
	@ApiNotFoundResponse({ description: 'User does not exists' })
	async findOne(@Param('id') id: string) {
		const user = await this.userService.findOne({ id });
		if (!user) {
			throw new NotFoundException();
		}
		return new UserEntity({ ...user });
	}

	@Patch(':id')
	@UseGuards(SelfGuard)
	@ApiBody({ type: UpdateUserDTO })
	@ApiOperation({ summary: 'Update a user' })
	@ApiOkResponse({ description: 'Successfully updated user', type: UserEntity })
	@ApiConflictResponse({ description: 'User e-mail already exists' })
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
		const user = await this.userService.update({ id }, updateUserDto);
		return new UserEntity({ ...user });
	}

	@Delete(':id')
	@UseGuards(SelfGuard)
	@ApiOperation({ summary: 'Delete a user' })
	@ApiOkResponse({ description: 'Successfully deleted user', type: UserEntity })
	@ApiNotFoundResponse({ description: 'User does not exists' })
	async remove(@Param('id') id: string) {
		const user = await this.userService.remove(id);
		return new UserEntity({ ...user });
	}
}

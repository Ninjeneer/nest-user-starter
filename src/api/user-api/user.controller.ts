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
import { RoleGuard } from '../../core/guards/role.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { TokenGuard } from '../../core/guards/token.guard';
import { UserService } from '../../core/user/user.service';
import { SelfGuard } from '../../core/guards/self.guard';
import {
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger';
import CreateUserDTO from '../../core/user/dto/create-user.dto';
import UpdateUserDTO from '../../core/user/dto/update-user.dto';
import User, { UserRole } from '../../core/user/entities/user.entity';
import { ForbiddenBasicActions, ForbiddenBasicException } from '../../core/exceptions/exceptions';

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
	@ApiCreatedResponse({ description: 'User created successfully', type: User })
	@ApiConflictResponse({ description: 'User e-mail already exists' })
	async create(@Req() request: Request, @Body() createUserDto: CreateUserDTO) {
		const user = await this.userService.create({ ip: request.ip, ...createUserDto });
		delete user.password;
		return user;
	}

	@Get()
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Retrieve all users' })
	@ApiOkResponse({ description: 'Successfully retrieved user list', type: [User] })
	async findAll() {
		return await this.userService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Retrieve a user' })
	@ApiOkResponse({ description: 'Successfully retrieved user', type: User })
	@ApiNotFoundResponse({ description: 'User does not exists' })
	async findOne(@Param('id') id: string) {
		const user = await this.userService.findOne(id);
		if (!user) {
			throw new NotFoundException();
		}
		return user;
	}

	@Patch(':id')
	@UseGuards(SelfGuard)
	@ApiBody({ type: UpdateUserDTO })
	@ApiOperation({ summary: 'Update a user' })
	@ApiOkResponse({ description: 'Successfully updated user', type: User })
	@ApiConflictResponse({ description: 'User e-mail already exists' })
	async update(@Req() request: Request, @Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
		if (request.user.role === UserRole.BASIC && updateUserDto.role && updateUserDto.role !== UserRole.BASIC) {
			throw new ForbiddenBasicException([ForbiddenBasicActions.UPDATE_ROLE]);
		}
		return await this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	@UseGuards(SelfGuard)
	@ApiOperation({ summary: 'Delete a user' })
	@ApiOkResponse({ description: 'Successfully deleted user', type: User })
	@ApiNotFoundResponse({ description: 'User does not exists' })
	async remove(@Param('id') id: string) {
		return await this.userService.remove(id);
	}
}

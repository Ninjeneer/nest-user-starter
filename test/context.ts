import { PrismaClient } from '@prisma/client';
import { SecurityService } from '../src/security/security.service';
import { UserRole } from '../src/user/user.service';
import config from '../src/assets/config.json';

const prisma = new PrismaClient();
const securityService = new SecurityService();

prisma.user
	.create({
		data: {
			email: config.tests.admin.email,
			password: securityService.hashPassword(config.tests.admin.password),
			role: UserRole.ADMIN
		}
	})
	.then((user) => console.log(`${user.email} created successfully`))
	.catch((e) => console.log(e));

prisma.user
	.create({
		data: {
			email: config.tests.basic.email,
			password: securityService.hashPassword(config.tests.basic.password),
			role: UserRole.BASIC
		}
	})
	.then((user) => console.log(`${user.email} created successfully`))
	.catch((e) => console.log(e));

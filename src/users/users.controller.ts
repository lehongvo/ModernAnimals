import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Session, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from './dtos/user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }

    @Get("/whoami")
    @UseGuards(AuthGuard)
    async whoAmI(@CurrentUser() user: any) {
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    @Post("/signout")
    async signOut(@Session() session: any) {
        if (!session.userId) {
            throw new NotFoundException("User not found");
        }
        session.userId = null;
        return "Signed out successfully";
    }

    @Post("/signup")
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post("/signin")
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Get('')
    async findAllUsers(@Session() session: any) {
        return this.usersService.findAll();
    }

    @Delete('/:id')
    async removeUser(@Param('id') id: number, @Session() session: any) {
        const user = await this.usersService.remove(session.userId);
        session.userId = null;
        return user;
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: number, @Body() body: Partial<CreateUserDto>) {
        return this.usersService.update(id, body);
    }
}
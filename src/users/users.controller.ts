import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, Session, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserDtoForAdmin } from './dtos/create-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from './dtos/user.dto';
import { AuthGuardCLT, JwtAuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateJwtDtoPayloads } from './dtos/create-jwt.dto';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private jwtService: JwtService
    ) { }

    @Get("/whoami")
    @UseGuards(AuthGuardCLT)
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

    @Post("/signupWithAdmin")
    async createNewAdmin(@Body() body: CreateUserDtoForAdmin, @Session() session: any) {
        const allUsers = await this.usersService.findAll();
        if (allUsers.length > 0) {
            console.log("session.userId", session.userId)
            if (!session.userId) {
                throw new NotFoundException("User id not found");
            }
            const currentUser = await this.usersService.findOne(session.userId);
            if (!currentUser) {
                throw new NotFoundException("User not found");
            }
            if (!currentUser.admin) {
                throw new NotFoundException("Not admin permission");
            }
        }

        const user = await this.authService.signup(body.email, body.password, true);
        session.userId = user.id;
        return user;
    }

    @Post("/signup")
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const allUsers = await this.usersService.findAll();
        if (allUsers.length == 0) {
            throw new NotFoundException("Server in maintenance");
        }
        const user = await this.authService.signup(body.email, body.password, false);
        session.userId = user.id;
        return user;
    }

    @Post("/signin")
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        let user = await this.authService.signin(body.email, body.password);
        const payload: CreateJwtDtoPayloads = {
            email: user.email
        }
        const accessToken = this.jwtService.sign(payload);
        session.userId = user.id;
        return { ...user, accessToken };
    }

    @Get('')
    @UseGuards(AuthGuardCLT)
    async findAllUsers(@Session() session: any) {
        const userCookieData = await this.usersService.findOne(session.userId);
        if (!userCookieData.admin) {
            throw new NotFoundException("Only admin");
        }
        return this.usersService.findAll();
    }


    @Delete()
    @UseGuards(AuthGuardCLT)
    async removeUser(
        @Body() body: CreateUserDto,
        @Session() session: any
    ) {
        const [user] = await this.usersService.find(body.email);
        if (!session.userId || !user) {
            throw new NotFoundException("User not found");
        }

        const userCookieData = await this.usersService.findOne(session.userId);
        if (!userCookieData.admin) {
            if (session.userId != user.id) {
                throw new NotFoundException("User not correct");
            }

            let currentUser = await this.authService.signin(body.email, body.password);
            if (!currentUser) {
                throw new NotFoundException("User not found");
            }
        }
        return await this.usersService.remove(user.id);
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: number, @Body() body: Partial<CreateUserDto>) {
        return this.usersService.update(id, body);
    }

    @Get("/test")
    async test() {
        console.log("req.user")
    }
}
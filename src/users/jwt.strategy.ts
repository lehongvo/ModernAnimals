import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";

import { CreateJwtDtoPayloads } from "./dtos/create-jwt.dto";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "./users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'topSecret51',
        });
    }

    async validate(payload: CreateJwtDtoPayloads) {
        const { email } = payload
        const user = await this.usersService.find(email);
        if (!user) {
            throw new UnauthorizedException('Validation user error')
        }
        return user
    }
}
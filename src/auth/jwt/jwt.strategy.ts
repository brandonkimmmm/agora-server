import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { omit } from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { INVALID_JWT_TOKEN } from 'src/shared/messages';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT.SECRET')
        });
    }

    async validate(payload: any) {
        const user = await this.prismaService.user.findFirst({
            where: {
                id: payload.sub,
                username: payload.username,
                role: payload.role
            }
        });

        if (!user) throw new UnauthorizedException(INVALID_JWT_TOKEN);

        return omit(user, 'password');
    }
}

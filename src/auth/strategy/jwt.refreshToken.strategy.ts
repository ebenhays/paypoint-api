import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class JWTRefreshTokenStrategy extends PassportStrategy(Strategy,'jwt-refresh'){
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          passReqToCallback: true,
          secretOrKey: config.get("JWT_REFRESH_TOKEN"),
        });
      }

      async validate(payload: any) {
        const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()
        const userInfo = await this.getUser(payload.email)
        return {
            userName: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            orgId: userInfo.orgId,
            role: userInfo.role,
            status: userInfo.status,
            userGuid: userInfo.userGuid,
            refreshToken
        };
      }

      private async getUser(email:string):Promise<User>{
        const findUser = await this.prisma.user.findFirst({
            where:{
                email
            }
        })
        return findUser
    }
}
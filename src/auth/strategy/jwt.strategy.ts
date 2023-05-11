import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
    const userInfo = await this.getUser(payload.email)
    return {
        userName: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        orgId: userInfo.orgId,
        role: userInfo.role,
        status: userInfo.status,
        userGuid: userInfo.userGuid,
        fullName: userInfo.firstName + ' ' + userInfo.lastName
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
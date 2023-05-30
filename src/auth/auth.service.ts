import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IChangePassword, ISignin, ISignup } from "./dto";
import * as argon from 'argon2'
import { PrismaService } from "../prisma/prisma.service";
import { Status, User } from "@prisma/client";
import { SYSTEM_CODE, SYSTEM_MESSAGE } from "../utils/constants";
import { ISystemResponse } from "../utils/systemResonse";
import _ from 'lodash';
import moment from 'moment'
import { JwtService } from "@nestjs/jwt";



@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService, private config: ConfigService, private jwtService: JwtService) { }
    async signup(userData: ISignup): Promise<ISystemResponse> {
        //create a user
        const hashPwd = await argon.hash(userData.password)
        const checkUser = await this.getUser(userData.email)

        if (checkUser) return {
            message: SYSTEM_MESSAGE.RECORD_ALREADY_EXIST,
            code: SYSTEM_CODE.RECORD_ALREADY_EXIST,
            data: null
        }

        const user = await this.prisma.user.create({
            data: {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                password: hashPwd,
                lastChangedDate: new Date(),
                role: userData.role,
                orgId: userData.orgCode,
                status: Status.ACTIVE,
                primaryPhone: userData.primaryPhone,
                secondayPhone: userData.secondayPhone
            },
            select: {
                email: true,
                firstName: true,
                lastName: true,
                status: true

            }
        })
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: user
        }
    }

    async signin(data: ISignin): Promise<ISystemResponse> {
        const findUser = await this.prisma.user.findFirst({
            where: {
                email: data.email,
                status: Status.ACTIVE
            },
            include: {
                organization: true
            }
        })

        if (!findUser) return {
            message: SYSTEM_MESSAGE.UNKNOWN_ERROR,
            code: SYSTEM_CODE.UNKNOWN_ERROR,
            data: null,
            error: new ForbiddenException('Access Denied').getResponse()
        }
        const verifyPass = await argon.verify(findUser.password, data.password)
        if (!verifyPass) return {
            message: SYSTEM_MESSAGE.INVALID_CREDENTIALS,
            code: SYSTEM_CODE.INVALID_CREDENTIALS,
            data: null,
            error: new ForbiddenException('Access Denied').getResponse()
        }
        if (findUser.mustChangePassword) return {
            message: SYSTEM_MESSAGE.FIRST_TIME_LOGIN_CHANGE_PASSWORD,
            code: SYSTEM_CODE.FIRST_TIME_LOGIN_CHANGE_PASSWORD,
            data: null
        }
        // if(!_.isEmpty(findUser.lastChangedDate)){
        //     if(moment().diff(findUser.lastChangedDate,'days') >=45)return {
        //         message: SYSTEM_MESSAGE.PASSWORD_EXPIRED_CHANGE_PASSWORD,
        //         code:SYSTEM_CODE.PASSWORD_EXPIRED_CHANGE_PASSWORD,
        //         data: null
        //     }
        // }
        return {
            message: SYSTEM_MESSAGE.LOGIN_SUCCESSFUL,
            code: SYSTEM_CODE.LOGIN_SUCCESSFUL,
            data: {
                firstName: findUser.firstName,
                lastName: findUser.lastName,
                email: findUser.email,
                organization: {
                    orgName: findUser.organization.orgName,
                    orgCode: findUser.organization.orgCode
                },
                access_token: await this.jwtService.signAsync({
                    email: data.email,
                    role: findUser.role
                }, {
                    secret: this.config.get("JWT_SECRET"),
                    expiresIn: '1h'
                })
            }
        }
    }

    async changePassword(data: IChangePassword): Promise<ISystemResponse> {
        const findUser = await this.getUser(data.email)
        if (!findUser) return {
            message: SYSTEM_MESSAGE.UNKNOWN_ERROR,
            code: SYSTEM_CODE.UNKNOWN_ERROR,
            data: null
        }

        //update Password
        const updatePwd = await argon.hash(data.password)
        await this.prisma.user.update({
            where: {
                email: data.email
            },
            data: {
                password: updatePwd,
                lastChangedDate: moment().add(45, 'days').toDate(),
                mustChangePassword: false
            }
        })
        return {
            message: SYSTEM_MESSAGE.CHANGE_PASSWORD_SUCCESSFUL,
            code: SYSTEM_CODE.CHANGE_PASSWORD_SUCCESSFUL,
            data: null
        }

    }

    async resetPassword(email: string): Promise<ISystemResponse> {
        const findUser = await this.getUser(email)
        if (!findUser) {
            return {
                message: SYSTEM_MESSAGE.SUCCESSFUL,
                code: SYSTEM_CODE.SUCCESSFUL,
                data: null
            }
        }

        //TODO: send reset password to email
        return {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: null
        }
    }

    private async getUser(email: string): Promise<User> {
        const findUser = await this.prisma.user.findFirst({
            where: {
                email
            }
        })
        return findUser
    }
}
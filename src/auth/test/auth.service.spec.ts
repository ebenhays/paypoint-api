import { ConfigModule } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { Test, TestingModule } from "@nestjs/testing"
import { Status } from "@prisma/client"
import { PrismaService } from "../../prisma/prisma.service"
import { AuthService } from "../auth.service"

import * as argon from 'argon2'
import { IChangePassword, ISignin, ISignup } from "../dto"
import { SYSTEM_CODE, SYSTEM_MESSAGE } from "../../utils/constants"
import { ForbiddenException } from "@nestjs/common"

const mockCreateResponse = {
    email: 'abc@gmail.com',
    firstName: expect.any(String),
    lastName: expect.any(String),
    status: Status.ACTIVE,
    orgCode: undefined,
    secondayPhone: undefined
}

const siginupData: ISignup = {
    email: 'abc@gmail.com',
    password: 'L!feisgood123',
    firstName: 'Somename',
    lastName: 'SomeOtherName',
    role: "TELLER",
    primaryPhone: "0245487540"
}

const mockUser = {
    ...siginupData,
    mustChangePassword: false,
    lastChangedDate: new Date(),
    organization: {
        orgName: 'wizbiz',
        orgCode: 'ABC123'
    }
}

const siginData: ISignin = {
    email: 'abc@gmail.com',
    password: 'Abcd123@1'
}


const mockService = {
    user: {
        create: jest.fn().mockResolvedValue(mockCreateResponse),
        findFirst: jest.fn(),
        update: jest.fn()
    }
}
jest.mock('moment', () => {
    const moment = jest.requireActual('moment');
    return { default: moment };
});


const mockHash = 'argfdkdkdkd'

describe('Testing auth service', () => {

    let authService: AuthService
    let spyArgon = null
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, {
                provide: PrismaService,
                useValue: mockService
            }],
            imports: [
                ConfigModule.forRoot({}),
                JwtModule.register({
                    secretOrPrivateKey: 'MY-SECRET'
                }),
            ]
        })
            .compile()

        authService = module.get<AuthService>(AuthService)
        spyArgon = jest.spyOn(argon, 'hash').mockResolvedValue(mockHash)

    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('signup with new user', async () => {
        mockService.user.findFirst.mockResolvedValue(null)
        const mockResult = {
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: mockCreateResponse
        }
        const actual = await authService.signup(siginupData)
        expect(spyArgon).toHaveBeenCalled()
        expect(spyArgon).toHaveBeenCalledWith(siginupData.password)
        expect(mockService.user.create).toHaveBeenCalled()
        expect(actual).toEqual(mockResult)
    })

    test('signup with existing user', async () => {
        mockService.user.findFirst.mockResolvedValue(siginupData)
        const mockResult = {
            message: SYSTEM_MESSAGE.RECORD_ALREADY_EXIST,
            code: SYSTEM_CODE.RECORD_ALREADY_EXIST,
            data: null
        }
        const actual = await authService.signup(siginupData)
        expect(spyArgon).toHaveBeenCalled()
        expect(spyArgon).toHaveBeenCalledWith(siginupData.password)
        expect(actual).toEqual(mockResult)
    })

    test('change-password, for existing user', async () => {
        const changePasswordData: IChangePassword = {
            email: 'abc@gmail.com',
            password: 'Abcd@123',
            confirmPassword: 'Abcd@123'
        }

        const result = {
            message: SYSTEM_MESSAGE.CHANGE_PASSWORD_SUCCESSFUL,
            code: SYSTEM_CODE.CHANGE_PASSWORD_SUCCESSFUL,
            data: null
        }

        siginupData.email = changePasswordData.email

        const mockUser = mockService.user.findFirst.mockResolvedValue(siginupData)

        const mockUpdate = mockService.user.update.mockResolvedValue({})

        const actual = await authService.changePassword(changePasswordData)
        expect(spyArgon).toHaveBeenCalled()
        expect(spyArgon).toHaveBeenCalledWith(changePasswordData.password)
        expect(mockUpdate).toHaveBeenCalledTimes(1)
        expect(mockUser).toHaveBeenCalledTimes(1)
        expect(actual).toEqual(result)
    })

    test('change-password, for invalid user', async () => {
        const changePasswordData: IChangePassword = {
            email: 'abc@gmail.com',
            password: 'Abcd@123',
            confirmPassword: 'Abcd@123'
        }

        const result = {
            message: SYSTEM_MESSAGE.UNKNOWN_ERROR,
            code: SYSTEM_CODE.UNKNOWN_ERROR,
            data: null
        }


        const mockDbUser = mockService.user.findFirst.mockResolvedValue(null)

        const actual = await authService.changePassword(changePasswordData)
        expect(spyArgon).not.toHaveBeenCalled()
        expect(spyArgon).not.toHaveBeenCalledWith(changePasswordData.password)

        expect(mockDbUser).toHaveBeenCalledTimes(1)
        expect(actual).toEqual(result)
    })

    test('test sign in for non existing or disabled user', async () => {
        const mockFindUser = mockService.user.findFirst.mockResolvedValue(null)

        const actual = await authService.signin(siginData)
        const expected = {
            message: SYSTEM_MESSAGE.UNKNOWN_ERROR,
            code: SYSTEM_CODE.UNKNOWN_ERROR,
            data: null,
            error: new ForbiddenException('Access Denied').getResponse()
        }
        expect(mockFindUser).toHaveBeenCalled()
        expect(actual).toEqual(expected)
    })

    test('test sign in for invalid password', async () => {
        const mockFindUser = mockService.user.findFirst.mockResolvedValue(siginupData)
        const spyArgonVerify = jest.spyOn(argon, 'verify').mockResolvedValue(false)
        const actual = await authService.signin(siginData)
        expect(mockFindUser).toHaveBeenCalled()
        expect(spyArgonVerify).toHaveReturnedWith(Promise.resolve(false))
        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.INVALID_CREDENTIALS,
            code: SYSTEM_CODE.INVALID_CREDENTIALS,
            data: null,
            error: new ForbiddenException('Access Denied').getResponse()
        })
    })

    test('test sign in for valid password but must change password', async () => {
        mockUser.mustChangePassword = true
        const mockFindUser = mockService.user.findFirst.mockResolvedValue(mockUser)
        const spyArgonVerify = jest.spyOn(argon, 'verify').mockResolvedValue(true)
        const actual = await authService.signin(siginData)
        expect(mockFindUser).toHaveBeenCalled()
        expect(spyArgonVerify).toHaveReturnedWith(Promise.resolve(true))
        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.FIRST_TIME_LOGIN_CHANGE_PASSWORD,
            code: SYSTEM_CODE.FIRST_TIME_LOGIN_CHANGE_PASSWORD,
            data: null
        })
    })

    test('test sign in for valid password', async () => {
        mockUser.mustChangePassword = false
        const mockFindUser = mockService.user.findFirst.mockResolvedValue(mockUser)
        const spyArgonVerify = jest.spyOn(argon, 'verify').mockResolvedValue(true)
        const actual = await authService.signin(siginData)
        expect(mockFindUser).toHaveBeenCalled()
        expect(spyArgonVerify).toHaveReturnedWith(Promise.resolve(true))
        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.LOGIN_SUCCESSFUL,
            code: SYSTEM_CODE.LOGIN_SUCCESSFUL,
            data: {
                firstName: expect.any(String),
                lastName: expect.any(String),
                email: siginData.email,
                organization: {
                    orgName: expect.any(String),
                    orgCode: expect.any(String)
                },
                access_token: expect.any(String)
            }
        })
    })

    test('reset password', async () => {
        const mockResult = mockService.user.findFirst.mockResolvedValue(mockUser)
        const actual = await authService.resetPassword(mockUser.email)
        expect(mockResult).toHaveBeenCalled()
        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: null
        })
    })

    test('reset password with no user', async () => {
        const mockResult = mockService.user.findFirst.mockResolvedValue(null)
        const actual = await authService.resetPassword(mockUser.email)
        expect(mockResult).toHaveBeenCalled()
        expect(actual).toEqual({
            message: SYSTEM_MESSAGE.SUCCESSFUL,
            code: SYSTEM_CODE.SUCCESSFUL,
            data: null
        })

    })
})
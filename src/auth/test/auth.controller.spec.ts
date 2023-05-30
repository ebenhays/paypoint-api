
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { SYSTEM_CODE, SYSTEM_MESSAGE } from '../../utils/constants'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'
import { IChangePassword, ISignin, ISignup } from '../dto'


const mockAuthService = {
    signup: jest.fn(),
    changePassword: jest.fn(),
    signin: jest.fn(),
    resetPassword: jest.fn()

}
describe('Testing auth Controller', () => {
    let authController: AuthController
    let app: INestApplication

    const siginupData: ISignup = {
        email: 'abc@gmail.com',
        password: 'L!feisgood123',
        firstName: 'Somename',
        lastName: 'SomeOtherName',
        role: "TELLER",
        primaryPhone: "0245487540"
    }

    const result = {
        message: SYSTEM_MESSAGE.SUCCESSFUL,
        code: SYSTEM_CODE.SUCCESSFUL,
        data: {
            email: 'abc@gmail.com',
            firstName: 'Somename',
            lastName: 'SomeOtherName'
        }
    }

    const siginData: ISignin = {
        email: 'abc@gmail.com',
        password: 'Abcd123@1'
    }

    const mockSigninData = {
        message: SYSTEM_MESSAGE.LOGIN_SUCCESSFUL,
        code: SYSTEM_CODE.LOGIN_SUCCESSFUL,
        data: {
            firstName: expect.any(String),
            lastName: expect.any(String),
            organization: {
                orgName: expect.any(String),
                orgCode: expect.any(String)
            },
            access_token: expect.any(String)
        }
    }

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
        }).overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

        authController = moduleRef.get<AuthController>(AuthController);
        app = moduleRef.createNestApplication()
        await app.init()
        expect(authController).toBeDefined()
    });

    test('signup new user', async () => {

        const mockSignup = mockAuthService.signup.mockImplementation(() => result)
        const actual = await authController.signup(siginupData)

        expect(mockSignup).toHaveBeenCalled()
        expect(mockSignup).toBeCalledTimes(1)
        expect(actual).toEqual(result)
        expect(mockAuthService.signup).toHaveBeenCalledWith(siginupData)
    })


    test('change-password', async () => {

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

        const mockChangePassword = mockAuthService.changePassword.mockImplementation(() => result)

        const actual = await authController.changepassword(changePasswordData)

        expect(mockChangePassword).toHaveBeenCalled()
        expect(mockChangePassword).toBeCalledTimes(1)
        expect(actual).toEqual(result)
        expect(mockAuthService.changePassword).toHaveBeenCalledWith(changePasswordData)
    })

    test('signin', async () => {
        const mockSignin = mockAuthService.signin.mockImplementation(() => mockSigninData)
        const actual = await authController.signIn(siginData)
        expect(mockSignin).toHaveBeenCalled()
        expect(mockSignin).toHaveBeenCalledTimes(1)
        expect(mockSignin).toHaveBeenCalledWith(siginData)
        expect(actual).toEqual(mockSigninData)
    })

    test('reset-password', async () => {
        const mockedResponse = {
            message: SYSTEM_MESSAGE.LOGIN_SUCCESSFUL,
            code: SYSTEM_CODE.LOGIN_SUCCESSFUL,
            data: null
        }
        const mockResetPwd = mockAuthService.resetPassword.mockResolvedValue(mockedResponse)
        const actual = await authController.resetpassword('me@yahoo.com')
        expect(mockResetPwd).toHaveBeenCalled()
        expect(mockResetPwd).toHaveBeenCalledWith('me@yahoo.com')
        expect(actual).toEqual(mockedResponse)
    })
})
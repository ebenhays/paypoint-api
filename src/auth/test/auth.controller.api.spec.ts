import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing';
import { SYSTEM_CODE, SYSTEM_MESSAGE } from '../../utils/constants';
import * as request from 'supertest';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { IChangePassword, ISignup } from '../dto';

const authServiceMock = {
    signup: jest.fn(),
    signin: jest.fn(),
    changePassword: jest.fn(),
    resetPassword: jest.fn()
}

describe('Api testing routes', () => {
    let authController: AuthController
    let server = null
    let app: INestApplication

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],

        }).overrideProvider(AuthService)
            .useValue(authServiceMock)
            .compile()

        authController = module.get<AuthController>(AuthController)
        app = module.createNestApplication()
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init()
        server = app.getHttpServer()
    })

    const mockSign: ISignup = {
        email: 'abc@gmail.com',
        password: 'L!feisgood123',
        firstName: 'Somename',
        lastName: 'SomeOtherName',
        role: "TELLER",
        primaryPhone: "0245487540"
    }

    const mockSigninResponse = {
        message: SYSTEM_MESSAGE.SUCCESSFUL,
        code: SYSTEM_CODE.SUCCESSFUL,
        data: {
            email: 'abc@gmail.com',
            firstName: 'Somename',
            lastName: 'SomeOtherName'
        }
    }

    test('/POST/signup', async () => {
        authServiceMock.signup.mockResolvedValue(mockSigninResponse)
        return request(server)
            .post('/auth/signup')
            .send(mockSign)
            .expect(200)
            .expect(mockSigninResponse)
    })

    test('/POST/signin testing validations', async () => {
        return request(server)
            .post('/auth/signin')
            .send({})
            .expect(400)
    })

    test('/POST/signin testing validations when required values not present', async () => {
        return request(server)
            .post('/auth/signin')
            .send({
                email: 'me.com',
                lastName: ''
            })
            .expect(400)
    })

    test('/POST/signin ', async () => {
        authServiceMock.signin.mockImplementation(() => mockSigninResponse)
        return request(server)
            .post('/auth/signin')
            .send({
                email: 'me@me.com',
                password: 'My!strong123'
            })
            .expect(200)
            .expect(mockSigninResponse)
    })

    test.skip('/POST/change-password', async () => {
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

        authServiceMock.changePassword.mockResolvedValue(result)

        return request(server)
            .post('/auth/change-password')
            .send(changePasswordData)
            .expect(200)
            .expect(result)
    })

    test('/POST/reset-password', async () => {
        const result = {
            message: SYSTEM_MESSAGE.CHANGE_PASSWORD_SUCCESSFUL,
            code: SYSTEM_CODE.CHANGE_PASSWORD_SUCCESSFUL,
            data: null
        }

        authServiceMock.resetPassword.mockResolvedValue(result)
        return request(server)
            .post('/auth/reset-password')
            .send('eben@me.com')
            .expect(200)
            .expect(result)


    })
})
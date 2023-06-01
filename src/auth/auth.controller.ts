import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { IChangePassword, ISignin, ISignup } from "./dto";
import { JwtAuthGuard } from "./guard";

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    //@UseGuards(JwtAuthGuard)
    @Post('signup')
    @HttpCode(200)
    signup(@Body() data: ISignup) {
        return this.authService.signup(data)
    }

    @Post('signin')
    @HttpCode(200)
    signIn(@Body() data: ISignin) {
        return this.authService.signin(data)
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    @HttpCode(200)
    changepassword(@Body() data: IChangePassword) {
        try {
            return this.authService.changePassword(data)
        } catch (error) {
            console.log(error)
        }

    }

    @Post('reset-password')
    @HttpCode(200)
    resetpassword(@Body() email: string) {
        return this.authService.resetPassword(email)
    }

}
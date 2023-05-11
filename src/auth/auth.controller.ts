import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IChangePassword, ISignin, ISignup } from "./dto";
import { JwtAuthGuard } from "./guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    //@UseGuards(JwtAuthGuard)
    @Post('signup')
    signup(@Body() data: ISignup) {
        return this.authService.signup(data)
    }

    @Post('signin')
    signIn(@Body() data: ISignin) {
        return this.authService.signin(data)
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    changepassword(@Body() data: IChangePassword) {
        return this.authService.changePassword(data)
    }

    @Post('reset-password')
    resetpassword(@Body() email: string) {
        return this.authService.resetPassword(email)
    }

}
import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import type { LoginDTO } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from 'src/auth/jwt-guard';
import type { Enable2FAType, ExtendedRequest } from 'src/types';
import type { CreateUserDTO } from 'src/users/dto/create-user.dto';
import type { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
    private userService: UsersService,
    private authService: AuthService,
    ) {}

    @Post('signup')
    signup(@Body() userDTO: CreateUserDTO): Promise<User> {
        return this.userService.create(userDTO);
    }

    @Post('login')
    login(@Body() loginDTO: LoginDTO) {
        return this.authService.login(loginDTO);
    }

    @Get('enable-2fa')
    @UseGuards(JwtAuthGuard)
    enable2FA(@Req() req: ExtendedRequest): Promise<Enable2FAType> {
        return this.authService.enable2FA(req.user.userId);
    }

    @Get('disable-2fa')
    @UseGuards(JwtAuthGuard)
    disable2FA(@Request() req: ExtendedRequest) {
        return this.authService.disable2FA(req.user.userId);
    }

    @Post('validate-2fa')
    @UseGuards(JwtAuthGuard)
    validate2FA(
        @Request() req: ExtendedRequest,
        @Body() validateTokenDTO: { token: string },
    ): Promise<{ verified: boolean }> {
        return this.authService.validate2FAToken(
            req.user.userId,
            validateTokenDTO.token,
        );
    }

    @Get('profile')
    @UseGuards(AuthGuard('bearer'))
    getProfile(@Req() req: ExtendedRequest) {
        delete req.user.password;

        return { message: 'User profile', user: req.user };
    }
}

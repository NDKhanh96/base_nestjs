import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { GeneratedSecret } from 'speakeasy';
import * as speakeasy from 'speakeasy';
import type { LoginDTO } from 'src/auth/dto/login.dto';
import type { Enable2FAType, PayloadType } from 'src/types';
import { UsersService } from 'src/users/users.service';
import type { UpdateResult } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async login(
        loginDTO: LoginDTO,
    ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
        const user = await this.userService.findByEmail(loginDTO);
        const passwordMatch: boolean = await bcrypt.compare(
            loginDTO.password,
            user.password,
        );

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        delete user.password;
        const payload: PayloadType = {
            email: user.email,
            userId: user.id,
        };

        if (user.enable2FA && user.twoFASecret) {
            return {
                validate2FA: `${this.configService.get<string>('baseUrl')}/auth/validate-2fa`,
                message: 'Please login by validating the 2FA token.',
            };
        }

        return { accessToken: this.jwtService.sign(payload) };
    }

    async enable2FA(userId: number): Promise<Enable2FAType> {
        const user = await this.userService.findById(userId);

        if (user.enable2FA) {
            return { secret: user.twoFASecret };
        }

        const secret: GeneratedSecret = speakeasy.generateSecret();

        user.twoFASecret = secret.base32;
        await this.userService.updateSecretKey(user.id, user.twoFASecret);

        return { secret: user.twoFASecret };
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userService.disable2FA(userId);
    }

    async validate2FAToken(
        userId: number,
        token: string,
    ): Promise<{ verified: boolean }> {
        try {
            const user = await this.userService.findById(userId);
            const verified: boolean = speakeasy.totp.verify({
                secret: user.twoFASecret,
                encoding: 'base32',
                token,
            });

            return { verified: verified };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async validateUserByApiKey(apiKey: string) {
        return this.userService.findByApiKey(apiKey);
    }
}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ApiKeyStrategy } from 'src/auth/api-key-strategy';
import { authConstants } from 'src/auth/auth.constants';
import { JwtStrategy } from 'src/auth/jwt-strategy';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: authConstants.secret,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [AuthService, JwtStrategy, ApiKeyStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}

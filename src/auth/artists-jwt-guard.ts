import {
  ForbiddenException,
  Injectable,
  type ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Observable } from 'rxjs';
import type { PayloadType } from 'src/types';

@Injectable()
export class ArtistsJwtGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = PayloadType>(err: unknown, user: TUser): TUser {
    console.log(user);
    const isValidType: boolean =
      typeof user === 'object' &&
      user !== null &&
      !Array.isArray(user) &&
      'artistId' in user;

    if (err || !isValidType) {
      throw err || new ForbiddenException();
    }

    return user;
  }
}

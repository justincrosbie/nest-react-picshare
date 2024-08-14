import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = this.extractUserIDFromHeader(request);
    if (!userId) {
      throw new UnauthorizedException();
    }

    try {
      request['userId'] = userId;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractUserIDFromHeader(request: Request): string | undefined {
    const [type, userId] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'ID' ? userId : undefined;
  }
}

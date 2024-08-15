import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * AuthGuard is a custom guard that ensures a user is authenticated.
 * It checks for an authorization header in the request and extracts the user ID.
 * If the user ID is not present or invalid, it throws an UnauthorizedException.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  /**
   * Determines whether the current request is authorized.
   * @param context - The execution context, containing details about the current request.
   * @returns A boolean indicating if the request is authorized.
   * @throws UnauthorizedException if the user ID is missing or invalid.
   */
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

  /**
   * Extracts the user ID from the Authorization header.
   * The header should be in the format 'ID <userId>'.
   * @param request - The current request object.
   * @returns The user ID if present and valid; otherwise, undefined.
   */
  private extractUserIDFromHeader(request: Request): string | undefined {
    const [type, userId] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'ID' ? userId : undefined;
  }
}

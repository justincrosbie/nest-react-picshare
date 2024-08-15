import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';

/**
 * AuthService handles authentication-related tasks such as user login.
 */
@Injectable()
export class AuthService {
  /**
   * Constructs an instance of AuthService.
   *
   * @param usersService - A reference to the UsersService used for user-related operations.
   */
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  /**
   * Handles the login process for a user.
   * If the user does not exist, it creates the user.
   *
   * @param username - The username of the user attempting to log in.
   * @returns An object containing the user's ID.
   */
  async login(username: string): Promise<{ id: number }> {
    const user = await this.usersService.findOrCreate(username);
    return {
      id: user.id,
    };
  }
}

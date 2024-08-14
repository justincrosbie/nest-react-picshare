import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async login(username: string) {
    const user = await this.usersService.findOrCreate(username);
    return {
      id: user.id,
    };
  }
}

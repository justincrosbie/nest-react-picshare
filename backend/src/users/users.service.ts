import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthService } from '../auth/auth.service';

/**
 * UsersService handles the business logic related to user management, including finding or creating users and retrieving users by ID.
 */
@Injectable()
export class UsersService {
  /**
   * Constructs an instance of UsersService.
   *
   * @param usersRepository - The repository for managing User entities.
   * @param authService - The AuthService to manage authentication-related logic.
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  /**
   * Finds a user by their username. If the user does not exist, creates a new user with the provided username.
   *
   * @param username - The username to search for or create.
   * @returns The found or newly created user.
   */
  async findOrCreate(username: string): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      user = this.usersRepository.create({ username });
      await this.usersRepository.save(user);
    }
    return user;
  }

  /**
   * Finds a user by their ID.
   *
   * @param id - The ID of the user to find.
   * @returns The found user or null if the user does not exist.
   */
  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }
}

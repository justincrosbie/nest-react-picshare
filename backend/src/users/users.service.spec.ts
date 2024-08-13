import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            // Add any AuthService methods you're using in UsersService
            // For example:
            // login: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreate', () => {
    it('should return an existing user', async () => {
      const user = { id: 1, username: 'testuser' } as User;
      jest.spyOn(repo, 'findOne').mockResolvedValue(user);

      const result = await service.findOrCreate('testuser');

      expect(result).toEqual(user);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
    });

    it('should create a new user if not found', async () => {
      const user = { id: 1, username: 'testuser' } as User;
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      jest.spyOn(repo, 'create').mockReturnValue(user);
      jest.spyOn(repo, 'save').mockResolvedValue(user);

      const result = await service.findOrCreate('testuser');

      expect(result).toEqual(user);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(repo.create).toHaveBeenCalledWith({ username: 'testuser' });
      expect(repo.save).toHaveBeenCalledWith(user);
    });
  });
});

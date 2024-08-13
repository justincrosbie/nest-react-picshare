import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

// Mock AuthGuard
class MockAuthGuard {
  canActivate() {
    return true;
  }
}

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const user: User = { id: 1, username: 'testuser' } as User;
      jest.spyOn(service, 'findById').mockResolvedValue(user);

      const result = await controller.getUser('1');

      expect(result).toEqual(user);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('should handle user not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(controller.getUser('1')).rejects.toThrow('User not found');
    });
  });
});

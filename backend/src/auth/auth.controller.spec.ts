import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a token', async () => {
      const loginDto: LoginDto = { username: 'testuser' };
      const expectedResult = { access_token: 'token' };

      jest.spyOn(service, 'login').mockResolvedValue(expectedResult);

      expect(await controller.login(loginDto)).toBe(expectedResult);
      expect(service.login).toHaveBeenCalledWith(loginDto.username);
    });
  });
});

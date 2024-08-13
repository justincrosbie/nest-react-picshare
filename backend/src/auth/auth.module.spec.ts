import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { DataSource } from 'typeorm';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const mockDataSource = {
      createEntityManager: jest.fn(),
    };

    module = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(JwtService)
      .useValue({})
      .overrideProvider(DataSource)
      .useValue(mockDataSource)
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});

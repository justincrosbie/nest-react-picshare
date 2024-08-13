import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: +configService.get<number>('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should create a new user and return a token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'newuser' })
        .expect(201);

      expect(response.body.access_token).toBeDefined();
      authToken = response.body.access_token;

      // Decode the token to get the user ID
      const decodedToken = jwtService.decode(authToken) as { sub: number };
      userId = decodedToken.sub;
    });

    it('should return a token for an existing user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'newuser' })
        .expect(201);

      expect(response.body.access_token).toBeDefined();
    });

    it('should fail with invalid input', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return user details for authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.username).toBe('newuser');
    });

    it('should fail to get user details without authentication', async () => {
      await request(app.getHttpServer()).get(`/users/${userId}`).expect(401);
    });

    it('should fail to get non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/users/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should handle invalid user ID format', async () => {
      await request(app.getHttpServer())
        .get('/users/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid JWT token', async () => {
      await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should handle missing Authorization header', async () => {
      await request(app.getHttpServer()).get(`/users/${userId}`).expect(401);
    });
  });
});

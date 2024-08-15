import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Authenticates a user and returns a token.
   * @param loginDto - The credentials of the user attempting to log in.
   * @returns A JWT token if the login is successful.
   */
  @Post('login')
  @ApiOperation({ summary: 'Login a user and return a JWT token' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully authenticated.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username);
  }
}

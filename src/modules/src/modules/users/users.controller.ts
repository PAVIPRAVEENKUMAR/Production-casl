import { Controller, Post, Body, Get, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, Login } from './dto/user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SetPermissions } from '../shared/decorators/set-permissions.decorator';
import { Action } from '../shared/enums/enums';
import { Public } from '../shared/decorators/public.decorator';
import { CaslBaseGuard } from '../authz/casl.base.guard';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { AuthenticatedRequest } from '../items/interfaces/auth.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation error' })
  @ApiBody({ type: CreateUserDto, description: 'User details for registration' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully, returns JWT token' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @ApiBody({ type: Login, description: 'Email and password for login' })
  async login(@Body() login: Login) {
    const user = await this.authService.validateUser(login.email, login.password);
    return this.authService.login(user);
  }

  @Get('profile')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Authenticated user profile' })
  @ApiResponse({ status: 403, description: 'Forbidden - Permission denied' })
  @UseGuards(JwtAuthGuard, CaslBaseGuard)
  @SetPermissions(Action.Read, 'User')
  async getProfile(@Request()req: AuthenticatedRequest) {
    return {
      message: 'Access granted to profile',
      user: req.user,
    };
  }

  @Get('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin access' })
  @ApiResponse({ status: 200, description: 'Access granted to admin' })
  @ApiResponse({ status: 403, description: 'Forbidden - Permission denied' })
  @UseGuards(JwtAuthGuard, CaslBaseGuard)
  @SetPermissions(Action.Manage, 'all')
  async getAdmin(@Request() req) {
    return {
      message: 'Access granted to admin',
    };
  }
}

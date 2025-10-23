import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Welcome message',
    description: 'Returns a welcome message from the Barber Shop API.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Welcome message returned successfully.',
    schema: {
      type: 'string',
      example: 'Welcome to Barber Shop API!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Checks the API health status. Returns current status and timestamp.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'API is healthy and operational.',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
          description: 'Health status',
        },
        timestamp: {
          type: 'string',
          example: '2024-01-15T10:30:00.000Z',
          description: 'Current server timestamp',
        },
      },
    },
  })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}


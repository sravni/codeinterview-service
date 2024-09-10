import { Controller, Get } from '@nestjs/common';

@Controller({
  path: 'internal',
})
export class InternalController {
  @Get('/liveness')
  liveness() {
    return { message: 'OK' };
  }

  @Get('/readiness')
  readiness() {
    return { message: 'OK' };
  }
}

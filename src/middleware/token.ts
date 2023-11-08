import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityService } from 'src/utils/security';
import { UserService } from 'src/v1/user/user.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(
    private readonly securityService: SecurityService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token)
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized - Missing access_token' });

    try {
      if (req.url.includes('refresh_token') && req.body.refresh_token)
        return next();

      const decodedToken = await this.securityService.verifyToken(
        token as string,
      );

      if (decodedToken.role === 'admin') return next();

      if (req.body._id) {
        const user = await this.userService.getByIdService(req.body._id);

        if (user && decodedToken._id === user._id.toString()) return next();
      }

      if (req.method === 'GET' && !req.body._id) return next();

      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Forbidden' });
    } catch (error) {
      const { message } = error as Error;
      return res.status(HttpStatus.FORBIDDEN).json({ message });
    }
  }
}

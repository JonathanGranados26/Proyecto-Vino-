import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GqlAuthGuard {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    // Obtener el token del header Authorization
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('No se proporcionó token de autenticación');
    }

    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }

    try {
      // Verificar el token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'gws-wine-secret-key-2024',
      });

      // Adjuntar el payload al request para que esté disponible en el resolver
      request.user = payload;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
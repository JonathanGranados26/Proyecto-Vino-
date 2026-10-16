import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

/**
 * Pipe genérico para validar inputs con Zod
 * Decision: Creamos un pipe reutilizable en lugar de validar en cada resolver
 * Trade-off: Agrega una capa de abstracción pero mejora la consistencia
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        throw new BadRequestException({
          message: 'Error de validación',
          errors: errorMessages,
        });
      }
      throw error;
    }
  }
}
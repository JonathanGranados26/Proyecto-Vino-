import { z } from 'zod';
import { CreateProductSchema } from './create-product.schema';

/**
 * Schema para actualizar productos
 * Decision: Usamos .partial() para hacer todos los campos opcionales
 * excepto el ID que es requerido
 */
export const UpdateProductSchema = CreateProductSchema.partial().extend({
  id: z.string().uuid('El ID debe ser un UUID válido'),
});

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
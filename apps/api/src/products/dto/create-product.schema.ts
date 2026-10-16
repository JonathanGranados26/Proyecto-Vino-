import { z } from 'zod';

/**
 * Schema de validación para crear productos
 * Decision: Usamos Zod en lugar de class-validator porque:
 * - Más performante (validación en runtime sin decorators)
 * - Mejor DX con inferencia de tipos TypeScript
 * - Más flexible para validaciones complejas
 */
export const CreateProductSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  brand: z.string()
    .min(2, 'La marca debe tener al menos 2 caracteres')
    .max(50, 'La marca no puede exceder 50 caracteres'),
  
  category: z.string()
    .min(2, 'La categoría debe tener al menos 2 caracteres')
    .max(30, 'La categoría no puede exceder 30 caracteres'),
  
  description: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  
  presentation: z.string()
    .min(2, 'La presentación debe tener al menos 2 caracteres')
    .max(50, 'La presentación no puede exceder 50 caracteres'),
  
  alcoholicDegree: z.number()
    .min(0, 'El grado alcohólico no puede ser negativo')
    .max(100, 'El grado alcohólico no puede exceder 100%'),
  
  price: z.number()
    .positive('El precio debe ser positivo')
    .max(1000000, 'El precio no puede exceder $1,000,000'),
  
  currency: z.string()
    .length(3, 'La moneda debe ser un código ISO de 3 caracteres (ej: MXN, USD)')
    .default('MXN'),
  
  stock: z.number()
    .int('El stock debe ser un número entero')
    .nonnegative('El stock no puede ser negativo')
    .max(100000, 'El stock no puede exceder 100,000 unidades'),
  
  country: z.string().max(50).optional(),
  region: z.string().max(50).optional(),
  grape: z.string().max(50).optional(),
  
  vintage: z.number()
    .int()
    .min(1900, 'El año no puede ser anterior a 1900')
    .max(new Date().getFullYear(), 'El año no puede ser futuro')
    .optional(),
  
  score: z.number()
    .min(0, 'El puntaje no puede ser negativo')
    .max(100, 'El puntaje no puede exceder 100')
    .optional(),
  
  pairing: z.string().max(500).optional(),
  imageUrl: z.string().url('La URL de la imagen debe ser válida').optional(),
  
  images: z.array(z.string().url()).optional(),
  tastingNotes: z.array(z.string()).optional(),
});

// Inferir el tipo TypeScript desde el schema
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
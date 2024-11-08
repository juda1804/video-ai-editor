type ValidationFunction = (value: any) => boolean;

// Validadores básicos
export const required = () => ({
  validate: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    return !!value;
  },
  message: 'Este campo es requerido'
});

export const minLength = (min: number) => ({
  validate: (value: string): boolean => value.length >= min,
  message: `Debe tener al menos ${min} caracteres`
});

export const maxLength = (max: number) => ({
  validate: (value: string): boolean => value.length <= max,
  message: `Debe tener máximo ${max} caracteres`
});

export const isUrl = () => ({
  validate: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  message: 'Debe ser una URL válida'
});

export const matches = (regex: RegExp, customMessage?: string) => ({
  validate: (value: string): boolean => regex.test(value),
  message: customMessage || 'El formato ingresado no es válido'
});

// Validadores específicos
export const isSocialMediaUrl = () => ({
  validate: (value: string): boolean => {
    const tiktokRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\/@[\w.-]+\/?/;
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[\w.-]+\/?/;
    return tiktokRegex.test(value) || instagramRegex.test(value);
  },
  message: 'Solo se permiten links de TikTok o Instagram'
});

export const isEmail = () => ({
  validate: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  message: 'Debe ser un email válido'
});

export const isNumeric = () => ({
  validate: (value: string): boolean => !isNaN(Number(value)),
  message: 'Debe ser un número'
});

export const isPositive = () => ({
  validate: (value: number): boolean => value > 0,
  message: 'Debe ser un número positivo'
});

export const isInteger = () => ({
  validate: (value: number): boolean => Number.isInteger(Number(value)),
  message: 'Debe ser un número entero'
});

export const maxValue = (max: number) => ({
  validate: (value: number): boolean => Number(value) <= max,
  message: `Debe ser menor o igual a ${max}`
});

export const minValue = (min: number) => ({
  validate: (value: number): boolean => Number(value) >= min,
  message: `Debe ser mayor o igual a ${min}`
});

// Composición de validadores
export const composeValidators = (...validators: any[]) => (value: any) => {
  for (const validator of validators) {
    if (!validator.validate(value)) {
      return validator.message;
    }
  }
  return null;
}; 
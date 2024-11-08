import { useState } from 'react';

type Validator = {
  validate: (value: any) => boolean;
  message: string;
};

type ValidationRules = {
  [key: string]: Validator[];
};

export const useValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [dirty, setDirty] = useState<{ [key: string]: boolean }>({});

  // Valida un campo específico
  const validate = (field: string, value: any): boolean => {
    if (!rules[field]) return true;

    const fieldErrors: string[] = [];
    rules[field].forEach(validator => {
      if (!validator.validate(value)) {
        fieldErrors.push(validator.message);
      }
    });

    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors
    }));

    return fieldErrors.length === 0;
  };

  // Valida todos los campos del formulario
  const validateAll = (values: { [key: string]: any }): boolean => {
    let isValid = true;
    const newErrors: { [key: string]: string[] } = {};

    // Validar cada campo que tiene reglas definidas
    Object.keys(rules).forEach(field => {
      const fieldErrors: string[] = [];
      const value = values[field];

      rules[field].forEach(validator => {
        if (!validator.validate(value)) {
          fieldErrors.push(validator.message);
          isValid = false;
        }
      });

      newErrors[field] = fieldErrors;
    });

    setErrors(newErrors);
    return isValid;
  };

  // Marca un campo como tocado
  const touch = (field: string) => {
    setDirty(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Marca todos los campos como tocados
  const touchAll = () => {
    const allDirty: { [key: string]: boolean } = {};
    Object.keys(rules).forEach(field => {
      allDirty[field] = true;
    });
    setDirty(allDirty);
  };

  // Obtiene el primer error de un campo
  const getFieldError = (field: string): string | undefined => {
    return dirty[field] ? errors[field]?.[0] : undefined;
  };

  // Verifica si un campo es válido
  const isFieldValid = (field: string): boolean => {
    return !errors[field]?.length;
  };

  // Verifica si todo el formulario es válido
  const isFormValid = (): boolean => {
    return Object.keys(errors).every(field => !errors[field]?.length);
  };

  // Reinicia el estado de validación
  const resetValidation = () => {
    setErrors({});
    setDirty({});
  };

  // Obtiene todos los errores de un campo
  const getFieldErrors = (field: string): string[] => {
    return dirty[field] ? errors[field] || [] : [];
  };

  // Verifica si un campo ha sido tocado
  const isFieldTouched = (field: string): boolean => {
    return !!dirty[field];
  };

  return {
    validate,
    validateAll,
    touch,
    touchAll,
    getFieldError,
    getFieldErrors,
    isFieldValid,
    isFormValid,
    isFieldTouched,
    resetValidation,
    errors,
    dirty
  };
}; 
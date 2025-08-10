export interface ValidationRule {
  type: 'notEmpty' | 'minLength' | 'maxLength' | 'email' | 'password';
  value?: number | string;
  message: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  validationRules?: ValidationRule[];
  derived?: boolean;
  parentFields?: string[];
  formula?: string;
  options?: string[]; // For select/radio fields
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
}
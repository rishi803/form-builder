import React, { useState, useEffect } from 'react';
import { Box, TextField, Checkbox, FormControlLabel, Select, MenuItem, FormControl, RadioGroup, Radio, Typography } from '@mui/material';
import { FormSchema, FormField, ValidationRule } from '../../types';

interface FormPreviewProps {
  form: FormSchema;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [focusedFields, setFocusedFields] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Initialize form values with default values
    const initialValues = form.fields.reduce((acc, field) => {
      acc[field.id] = field.defaultValue ?? (field.type === 'checkbox' ? (field.options ? [] : false) : field.derived ? '0 years 0 months' : '');
      return acc;
    }, {} as { [key: string]: any });
    setFormValues(initialValues);
    // Validate initial values
    const initialErrors = form.fields.reduce((acc, field) => {
      acc[field.id] = field.derived ? '' : validateField(field, initialValues[field.id]);
      return acc;
    }, {} as { [key: string]: string });
    setErrors(initialErrors);
  }, [form]);

  const validateField = (field: FormField, value: any): string => {
    if (!field.validationRules || field.derived) return '';
    for (const rule of field.validationRules) {
      if (rule.type === 'notEmpty' && (value === '' || value === undefined || value === null || (field.type === 'checkbox' && (Array.isArray(value) ? value.length === 0 : !value)))) {
        return rule.message;
      }
      if (rule.type === 'minLength' && typeof value === 'string' && value.length < (rule.value as number)) {
        return rule.message;
      }
      if (rule.type === 'maxLength' && typeof value === 'string' && value.length > (rule.value as number)) {
        return rule.message;
      }
      if (rule.type === 'email' && typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return rule.message;
      }
      if (rule.type === 'password' && typeof value === 'string' && !/^(?=.*\d).{8,}$/.test(value)) {
        return rule.message;
      }
    }
    return '';
  };

  const computeDerivedValue = (field: FormField, values: { [key: string]: any }): string => {
    if (!field.parentFields || field.parentFields.length === 0 || !field.formula) {
      return '0 years 0 months';
    }
    try {
      const dateValue = values[field.parentFields[0]];
      if (!dateValue) return '0 years 0 months';
      const birthDate = new Date(dateValue);
      const today = new Date('2025-08-10'); // Fixed date for consistency
      if (isNaN(birthDate.getTime())) return '0 years 0 months';
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        years--;
        months += 12;
      }
      if (years < 0) return '0 years 0 months';
      return `${years} years ${months} months`;
    } catch {
      return '0 years 0 months';
    }
  };

  const handleChange = (fieldId: string, value: any) => {
    setFormValues((prev) => {
      const newValues = { ...prev, [fieldId]: value };
      const newErrors = { ...errors };

      // Validate the changed field
      const field = form.fields.find(f => f.id === fieldId);
      if (field && !field.derived) {
        newErrors[fieldId] = validateField(field, value);
      }

      // Update derived fields
      form.fields.forEach(f => {
        if (f.derived) {
          newValues[f.id] = computeDerivedValue(f, newValues);
          newErrors[f.id] = ''; // No validation for derived fields
        }
      });

      setErrors(newErrors);
      return newValues;
    });
  };

  const handleBlur = (fieldId: string) => {
    const field = form.fields.find(f => f.id === fieldId);
    if (field && !field.derived) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: validateField(field, formValues[fieldId]),
      }));
    }
    setFocusedFields((prev) => ({ ...prev, [fieldId]: false }));
  };

  const handleFocus = (fieldId: string) => {
    setFocusedFields((prev) => ({ ...prev, [fieldId]: true }));
  };

  const renderField = (field: FormField) => {
    const value = formValues[field.id] ?? (field.type === 'checkbox' ? (field.options ? [] : false) : field.derived ? '0 years 0 months' : '');
    const error = errors[field.id] ?? '';

    if (field.derived) {
      return (
        <Box key={field.id} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'medium' }}>{field.label}</Typography>
          <TextField
            value={value}
            disabled
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: '#f5f5f5' }}
          />
        </Box>
      );
    }

    return (
      <Box key={field.id} sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'medium' }}>{field.label}</Typography>
        {field.type === 'text' || field.type === 'textarea' || field.type === 'number' ? (
          <TextField
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            onFocus={() => handleFocus(field.id)}
            error={!!error}
            helperText={error}
            fullWidth
            multiline={field.type === 'textarea'}
            rows={field.type === 'textarea' ? 4 : 1}
            variant="outlined"
          />
        ) : field.type === 'date' ? (
          <TextField
            type="date"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onBlur={() => handleBlur(field.id)}
            onFocus={() => handleFocus(field.id)}
            error={!!error}
            helperText={error}
            fullWidth
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        ) : field.type === 'checkbox' ? (
          <Box>
            {field.options && field.options.length > 0 ? (
              field.options.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={Array.isArray(value) && value.includes(option)}
                      onChange={(e) => {
                        const updatedValue = e.target.checked
                          ? [...(Array.isArray(value) ? value : []), option]
                          : (Array.isArray(value) ? value : []).filter((v: string) => v !== option);
                        handleChange(field.id, updatedValue);
                      }}
                      onBlur={() => handleBlur(field.id)}
                      onFocus={() => handleFocus(field.id)}
                    />
                  }
                  label={option}
                />
              ))
            ) : (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value}
                    onChange={(e) => handleChange(field.id, e.target.checked)}
                    onBlur={() => handleBlur(field.id)}
                    onFocus={() => handleFocus(field.id)}
                  />
                }
                label=""
              />
            )}
            {error && <Typography color="error" variant="caption">{error}</Typography>}
          </Box>
        ) : field.type === 'select' ? (
          <FormControl fullWidth error={!!error}>
            <Select
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={() => handleBlur(field.id)}
              onFocus={() => handleFocus(field.id)}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="" disabled>Select option</MenuItem>
              {(field.options || ['Option 1', 'Option 2']).map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
            {error && <Typography color="error" variant="caption">{error}</Typography>}
          </FormControl>
        ) : field.type === 'radio' ? (
          <FormControl fullWidth error={!!error}>
            <RadioGroup
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onBlur={() => handleBlur(field.id)}
              onFocus={() => handleFocus(field.id)}
            >
              {(field.options || ['Option 1', 'Option 2']).map((option) => (
                <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
              ))}
            </RadioGroup>
            {error && <Typography color="error" variant="caption">{error}</Typography>}
          </FormControl>
        ) : null}
      </Box>
    );
  };

  return (
    <Box component="form" sx={{ mt: 3, p: 3, backgroundColor: '#fafafa', borderRadius: 2, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      {form.fields.map(renderField)}
    </Box>
  );
};

export default FormPreview;
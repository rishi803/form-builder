import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Checkbox, FormControlLabel, Box, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { updateField } from '../../store/slices/formSlice';
import { FormField } from '../../types';
import { RootState } from '../../store';
import ValidationRules from './ValidationRules';

interface FieldConfigProps {
  field: FormField;
}

const FieldConfig: React.FC<FieldConfigProps> = ({ field }) => {
  const dispatch = useDispatch();
  const fields = useSelector((state: RootState) => state.form.currentForm.fields);
  const [isDerived, setIsDerived] = useState(field.derived || false);
  const [newOption, setNewOption] = useState('');

  // Only allow number fields to be derived, and only if date fields exist
  const validParentFields = fields.filter(
    f => f.id !== field.id && !f.derived && f.type === 'date'
  );
  const canBeDerived = field.type === 'number' && validParentFields.length > 0;

  const handleChange = (updates: Partial<FormField>) => {
    dispatch(updateField({ ...field, ...updates }));
  };

  const handleDerivedToggle = (checked: boolean) => {
    setIsDerived(checked);
    handleChange({
      derived: checked,
      parentFields: checked ? field.parentFields || [] : [],
      formula: checked ? 'durationFromDate(field1)' : '',
      defaultValue: checked ? undefined : field.defaultValue,
    });
  };

  const addOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...(field.options || []), newOption.trim()];
      handleChange({ options: updatedOptions });
      setNewOption('');
    }
  };

  const deleteOption = (index: number) => {
    const updatedOptions = (field.options || []).filter((_, i) => i !== index);
    handleChange({ options: updatedOptions });
  };

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>{field.type.toUpperCase()} Field</Typography>
      <TextField
        label="Label"
        value={field.label}
        onChange={(e) => handleChange({ label: e.target.value })}
        fullWidth
        sx={{ mb: 2 }}
        variant="outlined"
      />
      {['select', 'radio', 'checkbox'].includes(field.type) ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Options</Typography>
          {(field.options || []).map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TextField
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...(field.options || [])];
                  updatedOptions[index] = e.target.value;
                  handleChange({ options: updatedOptions });
                }}
                fullWidth
                sx={{ mr: 1 }}
                variant="outlined"
              />
              <IconButton onClick={() => deleteOption(index)} color="error">
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="New Option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              fullWidth
              sx={{ mr: 1 }}
              variant="outlined"
            />
            <IconButton onClick={addOption} color="primary">
              <Add />
            </IconButton>
          </Box>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Default Value</InputLabel>
            <Select
              value={field.defaultValue ?? ''}
              onChange={(e) => handleChange({ defaultValue: e.target.value })}
              disabled={(field.options || []).length === 0}
            >
              {(field.options || []).map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : field.type === 'date' ? (
        <TextField
          label="Default Value"
          type="date"
          value={field.defaultValue ?? ''}
          onChange={(e) => handleChange({ defaultValue: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
          disabled={isDerived}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
        />
      ) : (
        <TextField
          label="Default Value"
          value={field.defaultValue ?? ''}
          onChange={(e) => handleChange({ defaultValue: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
          disabled={isDerived}
          variant="outlined"
        />
      )}
      <Tooltip title={canBeDerived ? "Compute duration from a date field" : "Add a date field to enable derived duration"}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isDerived}
              onChange={(e) => handleDerivedToggle(e.target.checked)}
              disabled={!canBeDerived}
            />
          }
          label="Derived Field (Duration)"
        />
      </Tooltip>
      {isDerived && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Parent Date Field</InputLabel>
          <Select
            value={field.parentFields?.[0] || ''}
            onChange={(e) => handleChange({ parentFields: [e.target.value as string] })}
          >
            {validParentFields.map(f => (
              <MenuItem key={f.id} value={f.id}>{f.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {!isDerived && <ValidationRules field={field} onUpdate={(rules) => handleChange({ validationRules: rules })} />}
    </Box>
  );
};

export default FieldConfig;
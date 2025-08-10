import React, { useState } from 'react';
import { Box, Button, Select, MenuItem, TextField, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ValidationRule } from '../../types';

interface ValidationRulesProps {
  field: { id: string; type: string };
  onUpdate: (rules: ValidationRule[]) => void;
}

const ValidationRules: React.FC<ValidationRulesProps> = ({ field, onUpdate }) => {
  const [rules, setRules] = useState<ValidationRule[]>([]);
  const [newRuleType, setNewRuleType] = useState<string>('');

  const availableRules = field.type === 'text' || field.type === 'textarea'
    ? ['notEmpty', 'minLength', 'maxLength', 'email', 'password']
    : field.type === 'number'
      ? ['notEmpty', 'minLength', 'maxLength']
      : ['notEmpty'];

  const addRule = () => {
    if (!newRuleType) return;
    const newRule: ValidationRule = {
      type: newRuleType as ValidationRule['type'],
      message: getDefaultMessage(newRuleType),
    };
    if (newRuleType === 'minLength' || newRuleType === 'maxLength') {
      newRule.value = 0;
    }
    if (newRuleType === 'password') {
      newRule.value = 'min8WithNumber';
    }
    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    onUpdate(updatedRules);
    setNewRuleType('');
  };

  const updateRule = (index: number, updates: Partial<ValidationRule>) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], ...updates };
    setRules(updatedRules);
    onUpdate(updatedRules);
  };

  const deleteRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
    onUpdate(updatedRules);
  };

  const getDefaultMessage = (type: string) => {
    switch (type) {
      case 'notEmpty': return 'This field is required';
      case 'minLength': return 'Minimum length not met';
      case 'maxLength': return 'Maximum length exceeded';
      case 'email': return 'Invalid email format';
      case 'password': return 'Password must be at least 8 characters and contain a number';
      default: return '';
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Select
        value={newRuleType}
        onChange={(e) => setNewRuleType(e.target.value)}
        displayEmpty
        sx={{ minWidth: 120, mr: 1 }}
      >
        <MenuItem value="" disabled>Add Validation Rule</MenuItem>
        {availableRules.map(rule => (
          <MenuItem key={rule} value={rule}>{rule}</MenuItem>
        ))}
      </Select>
      <Button onClick={addRule} disabled={!newRuleType}>Add Rule</Button>
      {rules.map((rule, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <TextField
            label="Message"
            value={rule.message}
            onChange={(e) => updateRule(index, { message: e.target.value })}
            sx={{ mr: 1 }}
          />
          {(rule.type === 'minLength' || rule.type === 'maxLength') && (
            <TextField
              label="Value"
              type="number"
              value={rule.value || 0}
              onChange={(e) => updateRule(index, { value: parseInt(e.target.value) })}
              sx={{ width: 100, mr: 1 }}
            />
          )}
          {rule.type === 'password' && (
            <TextField
              label="Rule"
              value="min8WithNumber"
              disabled
              sx={{ width: 150, mr: 1 }}
            />
          )}
          <IconButton onClick={() => deleteRule(index)}>
            <Delete />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default ValidationRules;
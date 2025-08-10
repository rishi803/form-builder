import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { FormField, FormSchema } from '../../types';

interface FormState {
  currentForm: FormSchema;
  forms: FormSchema[];
}

const initialState: FormState = {
  currentForm: { id: uuidv4(), name: '', createdAt: '', fields: [] },
  forms: JSON.parse(localStorage.getItem('forms') || '[]'),
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<Partial<FormField>>) => {
      const newField: FormField = {
        id: uuidv4(),
        type: action.payload.type || 'text',
        label: action.payload.label || 'New Field',
        required: action.payload.required || false,
        defaultValue: action.payload.defaultValue || '',
        validationRules: action.payload.validationRules || [],
        derived: action.payload.derived || false,
        parentFields: action.payload.parentFields || [],
        formula: action.payload.formula || '',
      };
      state.currentForm.fields.push(newField);
    },
    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.currentForm.fields[index] = action.payload;
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      state.currentForm.fields = action.payload;
    },
    saveForm: (state, action: PayloadAction<string>) => {
      const form: FormSchema = {
        ...state.currentForm,
        name: action.payload,
        createdAt: new Date().toISOString(),
      };
      state.forms.push(form);
      localStorage.setItem('forms', JSON.stringify(state.forms));
      state.currentForm = { id: uuidv4(), name: '', createdAt: '', fields: [] };
    },
    resetCurrentForm: (state) => {
      state.currentForm = { id: uuidv4(), name: '', createdAt: '', fields: [] };
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter(form => form.id !== action.payload);
      localStorage.setItem('forms', JSON.stringify(state.forms));
    },
  },
});

export const { addField, updateField, deleteField, reorderFields, saveForm, resetCurrentForm, deleteForm } = formSlice.actions;
export default formSlice.reducer;
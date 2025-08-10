import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Button, TextField, Box } from '@mui/material';
import { saveForm, resetCurrentForm } from '../store/slices/formSlice';
import { useNavigate } from 'react-router-dom';
import FormBuilder from '../components/FormBuilder/FormBuilder';
import { RootState } from '../store';

const CreateForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formName, setFormName] = useState('');
  const fields = useSelector((state: RootState) => state.form.currentForm.fields);

  const handleSave = () => {
    if (formName.trim() && fields.length > 0) {
      dispatch(saveForm(formName));
      dispatch(resetCurrentForm());
      setFormName('');
      navigate('/myforms');
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Create Form</Typography>
      <TextField
        label="Form Name"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <FormBuilder />
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={!formName.trim() || fields.length === 0}
        sx={{ mt: 2 }}
      >
        Save Form
      </Button>
    </Box>
  );
};

export default CreateForm;
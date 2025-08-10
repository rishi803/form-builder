import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { RootState } from '../store';
import { FormSchema } from '../types';
import FormPreview from '../components/FormPreview/FormPreview';

const PreviewForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const forms = useSelector((state: RootState) => state.form.forms);
  const form = forms.find((f: FormSchema) => f.id === id);

  if (!form) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4">Form Not Found</Typography>
        <Button variant="contained" onClick={() => navigate('/myforms')} sx={{ mt: 2 }}>
          Back to My Forms
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Preview: {form.name}
      </Typography>
      <FormPreview form={form} />
      <Button variant="contained" onClick={() => navigate('/myforms')} sx={{ mt: 2, mr: 1 }}>
        Back to My Forms
      </Button>
      <Button variant="outlined" onClick={() => navigate('/create')} sx={{ mt: 2 }}>
        Create New Form
      </Button>
    </Box>
  );
};

export default PreviewForm;
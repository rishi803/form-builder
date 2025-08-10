import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Button, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { RootState } from '../store';
import { FormSchema } from '../types';
import { deleteForm } from '../store/slices/formSlice';

const MyForms: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forms = useSelector((state: RootState) => state.form.forms);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the form "${name}"?`)) {
      dispatch(deleteForm(id));
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>My Forms</Typography>
      {forms.length === 0 ? (
        <Typography>No forms created yet.</Typography>
      ) : (
        <List>
          {forms.map((form: FormSchema) => (
            <ListItem
              key={form.id}
              secondaryAction={
                <Box>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/preview/${form.id}`)}
                    sx={{ mr: 1 }}
                  >
                    Preview
                  </Button>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(form.id, form.name)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={form.name}
                secondary={`Created: ${new Date(form.createdAt).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default MyForms;
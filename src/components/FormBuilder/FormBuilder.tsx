import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import { addField, deleteField, reorderFields } from '../../store/slices/formSlice';
import { FormField } from '../../types';
import FieldConfig from './FieldConfig';
import { RootState } from '../../store';

const FormBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const fields = useSelector((state: RootState) => state.form.currentForm.fields);
  const fieldTypes: FormField['type'][] = ['text', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date'];

  const handleAddField = (type: FormField['type']) => {
    if (type) {
      dispatch(addField({ type }));
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedFields = Array.from(fields);
    const [movedField] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, movedField);
    dispatch(reorderFields(reorderedFields));
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom>Add Field</Typography>
      <Select
        value=""
        onChange={(e) => handleAddField(e.target.value as FormField['type'])}
        displayEmpty
        sx={{ mb: 2, minWidth: 120 }}
      >
        <MenuItem value="" disabled>Select Field Type</MenuItem>
        {fieldTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </MenuItem>
        ))}
      </Select>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ minHeight: 100 }}
            >
              {fields.length === 0 ? (
                <Typography color="textSecondary">No fields added yet.</Typography>
              ) : (
                fields.map((field: FormField, index: number) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}
                      >
                        <FieldConfig field={field} />
                        <Button
                          color="error"
                          onClick={() => dispatch(deleteField(field.id))}
                          sx={{ mt: 1 }}
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default FormBuilder;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Container, CssBaseline } from '@mui/material';
import { store } from './store';
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <CssBaseline />
        <Container maxWidth="lg">
          <Routes>
            <Route path="/create" element={<CreateForm />} />
            <Route path="/preview/:id" element={<PreviewForm />} />
            <Route path="/myforms" element={<MyForms />} />
            <Route path="/" element={<CreateForm />} />
          </Routes>
        </Container>
      </Router>
    </Provider>
  );
};

export default App;
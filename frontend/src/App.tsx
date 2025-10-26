import React from 'react';
import { AddCandidateForm } from './components/organisms/AddCandidateForm';
import { CandidateSchemaType } from './schemas/candidateSchema';
import './App.css';

/**
 * Main App Component
 * ReactForm Turbo - El Formulario que Hasta Redux Envidiaría ⚡
 */
function App() {
  const handleSuccess = (data: CandidateSchemaType) => {
    console.log('✅ Candidato guardado exitosamente:', data);
    // Here you could navigate to candidates list or show success page
  };

  const handleCancel = () => {
    console.log('❌ Formulario cancelado');
    // Here you could navigate back or reset state
  };

  return (
    <div className="app">
      <div className="app-container">
        <AddCandidateForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default App;

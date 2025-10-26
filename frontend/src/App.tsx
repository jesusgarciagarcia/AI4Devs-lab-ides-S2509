import React, { useState } from 'react';
import { AddCandidateForm } from './components/organisms/AddCandidateForm';
import { CandidateList } from './components/organisms/CandidateList';
import { CandidateSchemaType } from './schemas/candidateSchema';
import './App.css';

type Page = 'form' | 'list';

/**
 * Main App Component
 * ReactForm Turbo - El Formulario que Hasta Redux Envidiaría ⚡
 */
function App() {
  const [currentPage, setCurrentPage] = useState<Page>('form');

  const handleSuccess = (data: CandidateSchemaType) => {
    console.log('✅ Candidato guardado exitosamente:', data);
    // Navigate to candidates list after successful creation
    setTimeout(() => {
      setCurrentPage('list');
    }, 2000);
  };

  const handleCancel = () => {
    console.log('❌ Formulario cancelado');
    setCurrentPage('list');
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="app-nav">
        <button
          className={`nav-button ${currentPage === 'form' ? 'active' : ''}`}
          onClick={() => setCurrentPage('form')}
          data-testid="nav-form"
        >
          ➕ Añadir Candidato
        </button>
        <button
          className={`nav-button ${currentPage === 'list' ? 'active' : ''}`}
          onClick={() => setCurrentPage('list')}
          data-testid="nav-list"
        >
          📋 Ver Candidatos
        </button>
      </nav>

      {/* Content */}
      <div className="app-container">
        {currentPage === 'form' ? (
          <AddCandidateForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <CandidateList />
        )}
      </div>
    </div>
  );
}

export default App;

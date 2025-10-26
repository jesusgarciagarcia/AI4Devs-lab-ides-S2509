/**
 * CandidateList Component
 * Displays a list of all candidates from the API
 */

import React, { useEffect, useState } from 'react';
import { getCandidates, Candidate } from '../../../services/candidateService';
import './CandidateList.css';

export const CandidateList: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const data = await getCandidates();
                setCandidates(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar candidatos');
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            const data = await getCandidates();
            setCandidates(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar candidatos');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="candidate-list-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando candidatos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="candidate-list-container">
                <div className="error-state">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button onClick={handleRefresh} className="btn-retry">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="candidate-list-container">
            <div className="candidate-list-header">
                <h1>📋 Lista de Candidatos</h1>
                <button onClick={handleRefresh} className="btn-refresh" data-testid="refresh-button">
                    🔄 Actualizar
                </button>
            </div>

            {candidates.length === 0 ? (
                <div className="empty-state">
                    <p>No hay candidatos registrados</p>
                    <p className="empty-state-hint">
                        Usa el formulario para añadir nuevos candidatos al sistema
                    </p>
                </div>
            ) : (
                <>
                    <div className="candidate-count">
                        Total: <strong>{candidates.length}</strong> candidato{candidates.length !== 1 ? 's' : ''}
                    </div>

                    <div className="candidate-grid">
                        {candidates.map((candidate) => (
                            <div key={candidate.id} className="candidate-card" data-testid={`candidate-${candidate.id}`}>
                                <div className="candidate-card-header">
                                    <h3>
                                        {candidate.firstName} {candidate.lastName}
                                    </h3>
                                    <span className="candidate-id">#{candidate.id}</span>
                                </div>

                                <div className="candidate-card-body">
                                    <div className="candidate-field">
                                        <span className="field-label">📧 Email:</span>
                                        <span className="field-value">{candidate.email}</span>
                                    </div>

                                    <div className="candidate-field">
                                        <span className="field-label">📞 Teléfono:</span>
                                        <span className="field-value">{candidate.phone}</span>
                                    </div>

                                    <div className="candidate-field">
                                        <span className="field-label">📍 Dirección:</span>
                                        <span className="field-value">{candidate.address}</span>
                                    </div>

                                    <div className="candidate-field">
                                        <span className="field-label">🎓 Educación:</span>
                                        <span className="field-value candidate-multiline">{candidate.education}</span>
                                    </div>

                                    <div className="candidate-field">
                                        <span className="field-label">💼 Experiencia:</span>
                                        <span className="field-value candidate-multiline">{candidate.workExperience}</span>
                                    </div>

                                    <div className="candidate-field">
                                        <span className="field-label">📅 Creado:</span>
                                        <span className="field-value">
                                            {new Date(candidate.createdAt).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

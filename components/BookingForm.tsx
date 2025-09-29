'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Role, GamingSystem, GAMING_SYSTEMS, ROLES } from '@/types';
import { saveBooking } from '@/lib/storage';

interface FormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  pronouns: string;
  roles: Role[];
  gamingSystems: GamingSystem[];
}

export default function BookingForm() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    pronouns: '',
    roles: [],
    gamingSystems: []
  });

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || [];
      setFormData(prev => ({
        ...prev,
        email: session.user.email || prev.email,
        firstName: nameParts[0] || prev.firstName,
        lastName: nameParts.slice(1).join(' ') || prev.lastName,
      }));
    }
  }, [session]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string | string[]}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string | string[]} = {};
    
    if (!formData.email) newErrors.email = 'Email è obbligatoria';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email non valida';
    
    if (!formData.phone) newErrors.phone = 'Numero di telefono è obbligatorio';
    if (!formData.firstName) newErrors.firstName = 'Nome è obbligatorio';
    if (!formData.lastName) newErrors.lastName = 'Cognome è obbligatorio';
    if (!formData.pronouns) newErrors.pronouns = 'Pronomi sono obbligatori';
    
    if (formData.roles.length === 0) {
      newErrors.roles = 'Seleziona almeno un ruolo';
    }
    
    if (formData.gamingSystems.length === 0) {
      newErrors.gamingSystems = 'Seleziona almeno un sistema di gioco';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula invio
      saveBooking(formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Errore durante l\'invio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (role: Role, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role)
    }));
  };

  const handleSystemChange = (system: GamingSystem, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      gamingSystems: checked 
        ? [...prev.gamingSystems, system]
        : prev.gamingSystems.filter(s => s !== system)
    }));
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Prenotazione Inviata!</h2>
          <p className="text-gray-600 mb-6">
            La tua prenotazione è stata ricevuta con successo. Ti contatteremo presto per confermare la tua partecipazione.
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setFormData({
                email: '',
                phone: '',
                firstName: '',
                lastName: '',
                pronouns: '',
                roles: [],
                gamingSystems: []
              });
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Nuova Prenotazione
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Prenotazione Sessione GDR</h2>
        {session?.user && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Accesso effettuato come {session.user.name}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            Nome *
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Il tuo nome"
          />
          {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
        </div>

        {/* Cognome */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Cognome *
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Il tuo cognome"
          />
          {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="mt-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="tua@email.com"
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Telefono */}
      <div className="mt-6">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Numero di Telefono *
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="+39 123 456 7890"
        />
        {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
      </div>

      {/* Pronomi */}
      <div className="mt-6">
        <label htmlFor="pronouns" className="block text-sm font-medium text-gray-700 mb-2">
          Pronomi *
        </label>
        <input
          type="text"
          id="pronouns"
          value={formData.pronouns}
          onChange={(e) => setFormData(prev => ({ ...prev, pronouns: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="es. lui/egli, lei/ella, loro/essi, altro..."
        />
        {errors.pronouns && <p className="text-red-600 text-sm mt-1">{errors.pronouns}</p>}
      </div>

      {/* Ruoli */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ruolo * (multiselezione)
        </label>
        <div className="space-y-2">
          {ROLES.map(role => (
            <label key={role.value} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.roles.includes(role.value)}
                onChange={(e) => handleRoleChange(role.value, e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{role.label}</span>
            </label>
          ))}
        </div>
        {errors.roles && <p className="text-red-600 text-sm mt-1">{errors.roles}</p>}
      </div>

      {/* Sistemi di Gioco */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sistemi di Interesse * (multiselezione)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {GAMING_SYSTEMS.map(system => (
            <label key={system.value} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.gamingSystems.includes(system.value)}
                onChange={(e) => handleSystemChange(system.value, e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{system.label}</span>
            </label>
          ))}
        </div>
        {errors.gamingSystems && <p className="text-red-600 text-sm mt-1">{errors.gamingSystems}</p>}
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Invio in corso...' : 'Invia Prenotazione'}
        </button>
      </div>
    </form>
  );
}

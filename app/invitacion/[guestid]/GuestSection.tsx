'use client';

import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface GuestSectionProps {
  guestName: string;
  initialCount?: number;
  guestId: string;
  onConfirmationSuccess?: () => void;
}

type GuestData = {
  exists: boolean;
  confirmed: boolean;
  personas: number;
  nombre: string;
};

export function GuestSection({ guestName, initialCount = 1, guestId, onConfirmationSuccess }: GuestSectionProps) {
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [guestCount, setGuestCount] = useState(initialCount);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [checkingConfirmation, setCheckingConfirmation] = useState(true);

  const increment = () => {
    if (guestCount < initialCount) {
      setGuestCount(guestCount + 1);
    }
  };

  const decrement = () => {
    if (guestCount > 1) {
      setGuestCount(guestCount - 1);
    }
  };

  useEffect(() => {
    const loadGuestData = async () => {
      try {
        const id = guestId.trim();
        const confirmationUrl = `/api/check-confirmation?guestId=${id}`;

        const response = await fetch(confirmationUrl);
        const data = await response.json();
        setGuestData(data);
      } catch (error) {
        console.error('Error al cargar datos del invitado:', error);
      } finally {
        setCheckingConfirmation(false);
      }
    };

    loadGuestData();
  }, [guestId]);

  const handleConfirm = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/confirm-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId,
          numberOfPeople: guestCount,
          confirmed: true
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback('¡Confirmación enviada exitosamente!');
        setMessage('');
        setGuestData({
          exists: true,
          confirmed: true,
          personas: guestCount,
          nombre: guestName
        });
        // Llamar a la función de callback para actualizar el estado del padre
        if (onConfirmationSuccess) {
          onConfirmationSuccess();
        }
      } else {
        setFeedback(data.error || 'Error al enviar la confirmación');
      }
    } catch (err) {
      setFeedback('Error de red al enviar la confirmación');
    }
    setLoading(false);
  };

  return (
    <section className="py-20 px-6 md:px-12 bg-linear-to-b from-white via-orange-50/30 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-8">
          {/* Título */}
          <div className="space-y-4">
            <p className="text-xs tracking-[0.4em] text-(--primary-text) uppercase">
              Invitación especial para
            </p>
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-linear-to-r from-orange-100 via-orange-50 to-orange-100 opacity-40 blur-xl rounded-full"></div>
              <h2 className="relative text-4xl md:text-5xl text-neutral-800 px-8 py-4 font-playfair">
                {guestName}
              </h2>
            </div>
          </div>

          {/* Separador decorativo */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-linear-to-r from-transparent to-orange-300"></div>
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <div className="w-12 h-px bg-linear-to-l from-transparent to-orange-300"></div>
          </div>

          {/* Control de cantidad de personas */}
          <div className="space-y-6 pt-4">
            <p className="text-sm text-neutral-600 font-libre-baskerville">
              Número de personas
            </p>

            {!guestData?.confirmed && (
            <div className="flex items-center justify-center gap-6">
              {/* Botón decrementar */}
              <button
                onClick={decrement}
                disabled={guestCount <= 1}
                className="group w-12 h-12 rounded-full border-2 border-orange-300 hover:border-orange-400 disabled:border-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center bg-white hover:bg-orange-50"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-5 h-5 text-orange-400 group-disabled:text-neutral-400" />
              </button>

              {/* Contador */}
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-orange-100 to-orange-50 rounded-2xl blur-sm"></div>
                <div className="relative bg-white border-2 border-orange-200 rounded-2xl px-10 py-6 shadow-sm">
                  <p className="text-5xl text-neutral-800 min-w-[60px] text-center">
                    {guestCount}
                  </p>
                </div>
              </div>

              {/* Botón incrementar */}
              <button
                onClick={increment}
                disabled={guestCount >= initialCount}
                className="group w-12 h-12 rounded-full border-2 border-orange-300 hover:border-orange-400 disabled:border-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center bg-white hover:bg-orange-50"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-5 h-5 text-orange-400 group-disabled:text-neutral-400" />
              </button>
            </div>
            )}
          
            {!guestData?.confirmed && (
              loading ? (
                <div className="mt-8 flex justify-center">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-400 rounded-full animate-spin"></div>
                </div>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="group relative mt-8 px-12 py-4 bg-linear-to-br from-orange-50 to-neutral-50 border-2 border-orange-200 text-neutral-800 rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-200/50 hover:scale-105 active:scale-100 hover:border-orange-300">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-100 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative text-base font-medium tracking-wide font-playfair">
                    Confirmar Asistencia
                  </span>
                </button>
              )
            )}

            {feedback && (
              <div className={`mt-6 p-4 rounded-lg ${
                feedback.includes('exitosamente') 
                  ? 'bg-green-50 border-2 border-green-200 text-green-800' 
                  : 'bg-red-50 border-2 border-red-200 text-red-800'
              }`}>
                <p className="text-sm font-medium">{feedback}</p>
              </div>
            )}

            {guestData?.confirmed && (
              <div className="mt-6 p-4 rounded-lg bg-blue-50 border-2 border-blue-200 text-blue-800">
                <p className="text-sm font-medium">✓ Ya has confirmado tu asistencia</p>
                {guestData.personas && (
                  <p className="text-xs mt-1">Personas confirmadas: {guestData.personas}</p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">
                Confirma tu Asistencia
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Tu presencia es muy importante para mí. Por favor confirma tu asistencia antes del 1 de Marzo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

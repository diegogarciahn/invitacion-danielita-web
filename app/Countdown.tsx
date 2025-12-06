'use client';
import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
      {/* Días */}
      <div className="group">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl hover:bg-white/25 transition-all duration-300 min-w-[120px] sm:min-w-[140px]">
          <div className="text-center space-y-2">
            <p className="text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-lg">
              {String(timeLeft.days).padStart(2, '0')}
            </p>
            <p className="text-xs sm:text-sm tracking-[0.2em] text-white/90 uppercase">
              Días
            </p>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="hidden sm:block text-3xl text-white/60">:</div>

      {/* Horas */}
      <div className="group">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl hover:bg-white/25 transition-all duration-300 min-w-[120px] sm:min-w-[140px]">
          <div className="text-center space-y-2">
            <p className="text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-lg">
              {String(timeLeft.hours).padStart(2, '0')}
            </p>
            <p className="text-xs sm:text-sm tracking-[0.2em] text-white/90 uppercase">
              Horas
            </p>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="hidden sm:block text-3xl text-white/60">:</div>

      {/* Minutos */}
      <div className="group">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl hover:bg-white/25 transition-all duration-300 min-w-[120px] sm:min-w-[140px]">
          <div className="text-center space-y-2">
            <p className="text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-lg">
              {String(timeLeft.minutes).padStart(2, '0')}
            </p>
            <p className="text-xs sm:text-sm tracking-[0.2em] text-white/90 uppercase">
              Minutos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

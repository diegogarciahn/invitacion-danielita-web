import Image from 'next/image';
import headerImage from '@/assets/44f8e112051cde060cb818cc3143c9e98e47507c.png';
import quinceaneraPhoto from '@/assets/a9f9fa670884b23c08c045cbcddb0c8544041d94.png';
import quinceaneraPhoto2 from '@/assets/1865e3ec7a35bff53dbe6d6684b7b561ac0bedf0.png';
import quinceaneraPhoto3 from '@/assets/45cd483a805c44404270bc8cea240a9907a15a62.png';
import countdownBg from '@/assets/b79ce2fd62fdaac53ac4e4be39ddaff686801b26.png';
import footerImage from '@/assets/84e6b2ca1b48490a0e3950cbc64d877e85505545.png';
import { PhotoSlider } from './PhotoSlider';
import { Countdown } from './Countdown';
import { GuestSection } from './GuestSection';

export default function QuinceanerraInvitation() {
  // Fecha del evento - 26 de Diciembre de 2025 a las 20:00
  const eventDate = new Date('2025-12-26T20:00:00');
  const guestName = "Familia García Pineda";

  return (
    <div className="min-h-screen bg-white">
      {/* Header Hero Section */}
      <header className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={headerImage}
            alt="Header background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-white"></div>
        </div>
        
        <div className="relative h-full flex items-end justify-center pb-20">
          <div className="text-center space-y-6 px-4">
            <div className="space-y-2">
              <p className="text-sm tracking-[0.4em] text-neutral-600 uppercase">
                Mis Quince Años
              </p>
              <h1 className="text-6xl md:text-7xl tracking-tight text-neutral-800">
                Daniela Bolaños
              </h1>
            </div>
            <div className="w-16 h-px bg-orange-400 mx-auto"></div>
            <p className="text-neutral-600 tracking-wide">
              26 de Diciembre, 2025
            </p>
          </div>
        </div>
      </header>

      {/* Sección de bienvenida */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <div className="space-y-6">
          <p className="text-xs tracking-[0.3em] text-orange-400 uppercase">
            Una celebración especial
          </p>
          <h2 className="text-3xl md:text-4xl text-neutral-800 max-w-2xl mx-auto">
            Con gran alegría te invito a celebrar este momento tan importante en mi vida
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Acompáñame en esta noche mágica donde daré un paso más hacia mis sueños
          </p>
        </div>
      </section>

      {/* Sección con foto y mensaje personal */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Slider de Imágenes */}
            <div className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-br from-orange-100 to-orange-50 rounded-lg opacity-50"></div>
                <div className="relative">
                  <PhotoSlider
                    images={[quinceaneraPhoto, quinceaneraPhoto2, quinceaneraPhoto3]}
                    autoplaySpeed={4000}
                  />
                </div>
              </div>
            </div>

            {/* Texto */}
            <div className="order-1 md:order-2 space-y-6">
              <div className="w-12 h-px bg-orange-400"></div>
              <h3 className="text-3xl md:text-4xl text-neutral-800">
                Un sueño hecho realidad
              </h3>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  Hoy cumplo quince años y mi corazón está lleno de gratitud. Este día marca el inicio de una nueva etapa en mi vida, llena de sueños, esperanzas y metas por alcanzar.
                </p>
                <p>
                  Quiero compartir este momento tan especial contigo, porque tu presencia y cariño han sido parte fundamental de mi camino. Gracias por estar aquí y ser parte de mi historia.
                </p>
                <p className="italic text-neutral-500">
                  Con todo mi cariño,
                </p>
                <p className="text-orange-400">
                  Daniela
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cuenta Regresiva con efecto liquid glass */}
      <section className="relative py-32 px-6 md:px-12 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src={countdownBg}
            alt="Countdown background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-orange-400/30 via-orange-300/20 to-orange-400/30"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.4em] text-white uppercase drop-shadow-lg">
              Faltan
            </p>
            <div className='h-15'></div>
          </div>

          <Countdown targetDate={eventDate} />
        </div>
      </section>

      {/* Detalles del evento */}
      <section className="py-20 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Fecha */}
            <div className="text-center space-y-4 p-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-orange-400 rounded-sm"></div>
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">
                  Fecha
                </p>
                <p className="text-2xl text-neutral-800">26</p>
                <p className="text-neutral-600">Diciembre 2025</p>
                <p className="text-sm text-neutral-500">Viernes</p>
              </div>
            </div>

            {/* Hora */}
            <div className="text-center space-y-4 p-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-orange-400 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">
                  Hora
                </p>
                <p className="text-2xl text-neutral-800">6:00 PM</p>
                <p className="text-sm text-neutral-500">Recepción</p>
              </div>
            </div>

            {/* Lugar */}
            <div className="text-center space-y-4 p-8">
              <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-orange-400 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">
                  Lugar
                </p>
                <p className="text-neutral-800">Colegio de abogados</p>
                <p className="text-sm text-neutral-600">Salón de Eventos</p>
                <p className="text-xs text-neutral-500">Calle salida a Marcovia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dress Code */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-linear-to-br from-orange-50 to-neutral-50 rounded-lg p-12 text-center space-y-6">
            <p className="text-xs tracking-[0.3em] text-orange-400 uppercase">
              Código de Vestimenta
            </p>
            <p className="text-2xl text-neutral-800">Etiqueta Formal</p>
            <p className="text-sm text-neutral-600 italic">
              Se sugiere vestimenta en tonos claros y pasteles
            </p>
          </div>
        </div>
      </section>

      {/* Confirmación de asistencia */}
      <section className="py-24 px-6 md:px-12 bg-neutral-50/50">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">
              Confirma tu Asistencia
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Tu presencia es muy importante para mí. Por favor confirma tu asistencia antes del 1 de Marzo
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="inline-block bg-white px-8 py-4 rounded-full shadow-sm">
              <p className="text-neutral-800">+52 555 123 4567</p>
            </div>
            <p className="text-xs text-neutral-500">WhatsApp disponible</p>
          </div>
        </div>
      </section>

      {/* Sección de invitado */}
      <GuestSection guestName={guestName} />

      {/* Footer con efecto glassmorphism */}
      <footer className="relative py-32 md:py-40 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src={footerImage}
            alt="Footer background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-white/20"></div>
        </div>

        {/* Contenido con efecto glass */}
        <div className="relative z-10 flex items-center justify-center px-6">
          <div className="text-center">
            <h2 
              className="text-7xl md:text-8xl lg:text-9xl tracking-wider uppercase"
              style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 237, 213, 0.8) 50%, rgba(255, 255, 255, 0.9) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 8px 32px rgba(251, 146, 60, 0.2)',
                backdropFilter: 'blur(10px)',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
              }}
            >
              Te Espero
            </h2>
            <div className="mt-8 w-24 h-px bg-linear-to-r from-transparent via-white/60 to-transparent mx-auto"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
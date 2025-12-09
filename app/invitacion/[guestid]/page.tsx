import Image from 'next/image';
import headerImage from '@/assets/44f8e112051cde060cb818cc3143c9e98e47507c.png';
import quinceaneraPhoto from '@/assets/a9f9fa670884b23c08c045cbcddb0c8544041d94.png';
import quinceaneraPhoto2 from '@/assets/1865e3ec7a35bff53dbe6d6684b7b561ac0bedf0.png';
import quinceaneraPhoto3 from '@/assets/45cd483a805c44404270bc8cea240a9907a15a62.png';
import quinceaneraPhoto4 from '@/assets/DODU6_3311.jpg';
import countdownBg from '@/assets/b79ce2fd62fdaac53ac4e4be39ddaff686801b26.png';
import footerImage from '@/assets/84e6b2ca1b48490a0e3950cbc64d877e85505545.png';
import { PhotoSlider } from './PhotoSlider';
import { Countdown } from './Countdown';
import { GuestSection } from './GuestSection';
import { Metadata } from 'next';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

// Función para generar meta tags dinámicos
export async function generateMetadata({ params }: { params: { guestid: string } }): Promise<Metadata> {
  const { guestid: guestId } = await params;
  
  try {
    // Consultar Firestore para obtener el nombre del invitado
    const docRef = doc(db, 'invitados', guestId.trim());
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const nombre = data?.Nombre || 'Invitado especial';
      const personas = data?.Personas || 1;
      
      const title = `¡${nombre}, ${personas > 1 ? 'están invitados' : 'estás invitado'} a mis 15 años!`;
      const description = `Hola ${nombre}, me encantaría que me ${personas > 1 ? 'acompañen' : 'acompañes'} en este día tan especial. ${personas > 1 ? 'Su' : 'Tu'} invitación incluye ${personas} ${personas === 1 ? 'persona' : 'personas'}.`;

      // Obtiene el host desde variable de entorno o fallback
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      // Agregar timestamp para evitar cacheo de imagen
      const timestamp = Date.now();
      const imageUrl = `${baseUrl}/api/og?guestId=${guestId}&t=${timestamp}`;
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'website',
          siteName: 'Mis 15 años',
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: `Invitación de 15 años para ${nombre}`,
            }
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [imageUrl],
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  // Fallback si no se encuentra el invitado
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const timestamp = Date.now();
  
  return {
    title: 'Invitación de 15 años',
    description: 'Me encantaría que me acompañes en este día tan especial.',
    openGraph: {
      title: 'Invitación de 15 años',
      description: 'Me encantaría que me acompañes en este día tan especial.',
      type: 'website',
      siteName: 'Mis 15 años',
      images: [`${baseUrl}/api/og?guestId=${guestId}&t=${timestamp}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Invitación de 15 años',
      description: 'Me encantaría que me acompañes en este día tan especial.',
      images: [`${baseUrl}/api/og?guestId=${guestId}&t=${timestamp}`],
    },
  };
}

export default async function QuinceanerraInvitation({ params }: { params: { guestid: string } }) {
  // Fecha del evento - 26 de Diciembre de 2025 a las 20:00
  const { guestid } = await params; 

  console.log('Guest ID recibido:', guestid);

  if (!guestid) {
    // Mensaje mejorado para guestId inválido
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen introduction-background px-4 relative overflow-hidden">
        {/* Flor de fondo con opacidad y object-fit cover */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <img src="/flor-1.svg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-md z-10">
          {/* Tarjeta blanca */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-(--primary) relative z-10">
            <h2 className="font-alex text-4xl text-(--primary-text) mb-4">¡Ups! Invitación no encontrada</h2>
            <p className="font-bodoni text-l text-gray-700 mb-6">El enlace que has utilizado no es válido o no corresponde a ningún invitado registrado.<br />Por favor revisa tu invitación o contacta a los anfitriones para más información.</p>
            <span className="inline-block px-4 py-2 bg-(--primary-text)/10 text-(--primary-text) rounded-full font-bodoni border border-(--primary-text)">Código de invitado no válido</span>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date('2025-12-26T18:00:00');

  // Consulta Firestore para obtener datos del invitado
  const docRef = doc(db, 'invitados', guestid.trim());
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists() || !guestid) {
    return (
      <div className="py-72 w-full px-8 text-center">
        <h2 className="font-alex text-5xl text-(--primary)">Invitación no encontrada</h2>
        <p className="font-bodoni text-sm">El enlace proporcionado no es válido. Por favor, verifica el enlace o contacta al organizador.</p>
      </div>
    );
  }

  const now = new Date();

  if (!docSnap.exists()) {
    await updateDoc(docRef, { Abierta: true, Aperturas: [now] });
  } else {
    // Agregar la hora de apertura actual a la lista Aperturas
    await updateDoc(docRef, { Aperturas: arrayUnion(now) });
  }

  const data = docSnap.data();
  const guestName = data?.Nombre || "Invitado";
  const guestCount = data?.Personas || 1;

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
              <p className="text-sm tracking-[0.4em] text-neutral-600 uppercase font-playfair">
                Mis Quince Años
              </p>
              <h1 className="text-6xl md:text-7xl tracking-tight text-(--primary-text) font-libre-baskerville ">
                Daniela Bolaños
              </h1>
            </div>
            <div className="w-16 h-px bg-orange-400 mx-auto"></div>
            <p className="text-neutral-600 tracking-wide font-libre-baskerville">
              26 de diciembre, 2025
            </p>
          </div>
        </div>
      </header>

      {/* Sección de bienvenida */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <div className="space-y-5">
          <p className="text-xs tracking-[0.3em] text-(--secondary-text) uppercase">
            Una celebración especial
          </p>
          <h2 className="text-2xl md:text-4xl text-neutral-800 max-w-2xl mx-auto font-libre-baskerville">
            Con gran alegría te invito a celebrar este momento tan importante en mi vida.
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto leading-relaxed font-libre-baskerville">
            Acompáñame en esta noche mágica donde daré un paso más hacia mis sueños.
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
                    images={[quinceaneraPhoto, quinceaneraPhoto2, quinceaneraPhoto3, quinceaneraPhoto4]}
                    autoplaySpeed={4000}
                  />
                </div>
              </div>
            </div>

            {/* Texto */}
            <div className="order-1 md:order-2 space-y-6">
              <div className="w-12 h-px bg-orange-400"></div>
              <h3 className="text-3xl md:text-4xl text-neutral-800 font-libre-baskerville">
                Un sueño hecho realidad
              </h3>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p className='font-libre-baskerville'>
                  Hoy cumplo Quince Años y mi corazón está lleno de gratitud. Este día marca el inicio de una nueva etapa en mi vida, llena de sueños, esperanzas y metas por alcanzar.
                </p>
                <p className='font-libre-baskerville'>
                  Quiero compartir este momento tan especial contigo, porque tu presencia y cariño han sido parte fundamental de mi camino.<br/><br/>Gracias por estar aquí y ser parte de mi historia.
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
                <p className="text-xs text-neutral-500">Calle salida a Marcovia, Choluteca.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dress Code */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-linear-to-br from-orange-50 to-neutral-50 rounded-lg p-12 text-center space-y-6">
            {/* Icono decorativo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-200/30 blur-xl rounded-full"></div>
                <div className="relative w-16 h-16 rounded-full bg-linear-to-br from-orange-100 to-orange-50 flex items-center justify-center border border-orange-200/50">
                  <svg 
                    className="w-8 h-8 text-orange-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-xs tracking-[0.3em] text-orange-400 uppercase">
              Código de Vestimenta
            </p>
            <p className="text-2xl text-neutral-800 font-libre-baskerville">Etiqueta Formal</p>
          </div>
        </div>
      </section>


      <section className="py-20 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-linear-to-br from-orange-50/50 via-white to-orange-50/30 rounded-2xl"></div>
            
            {/* Contenido */}
            <div className="relative p-8 md:p-12 text-center space-y-6">
              {/* Icono decorativo */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-200/30 blur-xl rounded-full"></div>
                  <div className="relative w-16 h-16 rounded-full bg-linear-to-br from-orange-100 to-orange-50 flex items-center justify-center border border-orange-200/50">
                    <svg 
                      className="w-8 h-8 text-orange-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Separador decorativo */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-px bg-linear-to-r from-transparent to-orange-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                <div className="w-8 h-px bg-linear-to-l from-transparent to-orange-300"></div>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <p className="text-xs tracking-[0.3em] text-orange-400 uppercase">
                  Sugerencia
                </p>
                <h3 className="text-2xl md:text-3xl text-neutral-800 font-libre-baskerville">
                  Tu presencia es mi mejor regalo
                </h3>
              </div>

              {/* Mensaje */}
              <div className="space-y-4 max-w-lg mx-auto">
                <p className="text-neutral-600 leading-relaxed font-libre-baskerville">
                  Si deseas tener un detalle conmigo, agradecería que fuera en efectivo. 
                  Esto me ayudará a cumplir mis sueños y metas para esta nueva etapa.
                </p>
                <p className="text-sm text-neutral-500 italic">
                  Sin embargo, lo más importante es que celebres este día especial a mi lado.
                </p>
              </div>

              {/* Decoración inferior */}
              <div className="pt-4">
                <div className="w-12 h-px bg-orange-300/50 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de invitado */}
      <GuestSection guestName={guestName} initialCount={guestCount} guestId={guestid} />

      {/* Footer con efecto glassmorphism */}
      {/* Footer - Diseño creativo con imagen y texto "Te Espero" */}
      <footer className="relative h-screen overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src={footerImage}
            alt="Footer background"
            fill
            className="object-cover"
            style={{ objectPosition: '70% center' }}
            sizes="100vw"
          />
        </div>

        {/* Degradado desde abajo hacia arriba */}
        <div className="absolute inset-0 bg-linear-to-t from-(--primary-container)/60 via-orange-300/20 to-transparent"></div>
        
        {/* Overlay sutil para profundidad */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-transparent to-transparent"></div>

        {/* Contenido */}
        <div className="relative h-full flex flex-col justify-end px-6 md:px-12 pb-16 md:pb-24">
          <div className="max-w-2xl">
            {/* Línea decorativa superior */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-white/40"></div>
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <div className="w-6 h-px bg-white/40"></div>
            </div>

            {/* Texto principal sin cuadro - directo sobre el degradado */}
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-7xl md:text-8xl lg:text-9xl tracking-wide uppercase leading-none text-(--primary-text)/80 font-libre-baskerville"
                >
                  Mis 15 Años
                </h2>
                {/* <h2 
                  className="text-7xl md:text-8xl lg:text-9xl tracking-wide uppercase leading-none text-(--primary-text)/80 font-playfair"
                >
                  Espero
                </h2> */}
              </div>

              {/* Subtexto elegante */}
              <div className="backdrop-blur-sm bg-white/20 rounded-xl px-6 py-3 inline-block border border-white/10">
                <p className="text-(--primary-text)/90 text-sm tracking-[0.3em] uppercase">
                  26 Diciembre 2025
                </p>
              </div>
            </div>

            {/* Línea decorativa inferior */}
            <div className="flex items-center gap-3 mt-12">
              <div className="w-20 h-px bg-linear-to-r from-white/60 to-transparent"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
            </div>
          </div>
        </div>

        {/* Elemento decorativo flotante - esquina superior derecha */}
        <div className="absolute top-12 right-6 md:top-20 md:right-12">
          <div className="backdrop-blur-sm bg-white/5 rounded-full p-6 border border-white/20">
            <div className="w-3 h-3 rounded-full bg-white/40"></div>
          </div>
        </div>

        {/* Elemento decorativo flotante - centro izquierda */}
        <div className="hidden md:block absolute top-1/3 left-12">
          <div className="backdrop-blur-sm bg-white/5 rounded-full p-4 border border-white/20">
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
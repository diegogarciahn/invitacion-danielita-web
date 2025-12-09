import { ImageResponse } from 'next/og';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

// Cargar las fuentes desde archivos locales con fallback
function loadLocalFonts() {
  const fontsDir = join(process.cwd(), 'public', 'fonts');

  try {
    const bodoniPath = join(fontsDir, 'bodoni-moda.ttf');
    const alexPath = join(fontsDir, 'alex-brush.ttf');

    if (!existsSync(bodoniPath) || !existsSync(alexPath)) {
      throw new Error('Font files not found');
    }

    const bodoniFont = readFileSync(bodoniPath);
    const alexBrushFont = readFileSync(alexPath);

    return { bodoniFont, alexBrushFont };
  } catch (error) {
    console.error('Error loading local fonts:', error);
    throw error;
  }
}

function loadImage(imagePath: string) {
  try {
    const fullPath = join(process.cwd(), 'public', imagePath);

    if (!existsSync(fullPath)) {
      throw new Error(`Image not found: ${imagePath}`);
    }

    const imageBuffer = readFileSync(fullPath);
    const base64 = imageBuffer.toString('base64');

    // Determinar el tipo MIME basado en la extensión
    const extension = imagePath.split('.').pop()?.toLowerCase();
    let mimeType = 'image/jpeg'; // default

    if (extension === 'png') mimeType = 'image/png';
    if (extension === 'svg') mimeType = 'image/svg+xml';
    if (extension === 'webp') mimeType = 'image/webp';

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');

    if (!guestId) {
      return new Response('Guest ID is required', { status: 400 });
    }

    // Consultar Firestore para obtener el nombre del invitado
    let nombre = 'Invitado especial';
    let personas = 1;

    try {
      const docRef = doc(db, 'invitados', guestId.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        nombre = data?.Nombre || 'Invitado especial';
        personas = data?.Personas || 1;
        console.log(`Generating OG image for guest: ${nombre} (${guestId})`);
      } else {
        console.log(`Guest not found: ${guestId}`);
      }
    } catch (error) {
      console.error('Error fetching guest data:', error);
    }

    // Obtener las fuentes
    const { bodoniFont, alexBrushFont } = loadLocalFonts();
    const backgroundImage = loadImage('flor-1.svg');
    const nosotrosImage = loadImage('confirmation.jpeg');

    const response = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F2C3A7', // --primary-container (base color)
            position: 'relative',
          }}
        >
          {/* Decoración de fondo con borde elegante */}
          <div
            style={{
              position: 'absolute',
              top: '30px',
              left: '30px',
              right: '30px',
              bottom: '30px',
              border: '3px solid #FFF8F3', // --on-primary-container-highlight (blanco cálido)
              borderRadius: '24px',
              display: 'flex',
              zIndex: 3,
            }}
          />
          {/* 
          <img
            src={nosotrosImage || ''}
            style={{
              zIndex: 0,
              position: 'absolute',
              objectFit: 'contain',
              left: '0%',
              width: '500px',
              height: '800px',
            }}
            alt="Background"></img> */}

          <img
            src={backgroundImage || ''}
            style={{
              zIndex: 1,
              position: 'absolute',
              opacity: 0.03,
            }}
            alt="Background"></img>

          {/* Contenido principal */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            {/* Nombre del invitado - estilo Alex Brush */}
            <h1
              style={{
                fontSize: '90px',
                fontFamily: 'Alex Brush',
                color: '#3D1501', // Marrón oscuro cálido para mejor contraste
                fontWeight: '400',
                letterSpacing: '1px',
                textAlign: 'center',
                marginBottom: '0px',
              }}
            >
              {nombre}
            </h1>

            {/* Conectivo "y" estilo como en Header */}
            {/* <div
              style={{
                fontSize: '36px',
                fontFamily: 'Bodoni Moda',
                color: '#FEFFDB', // --on-primary-container-highlight
                fontWeight: '400',
              }}
            >
              Estás invitado a
            </div> */}

            {/* "Nuestra boda" estilo Alex Brush como en Introduction */}

            {/* Información de personas - estilo Bodoni */}
            {/* <p
              style={{
                fontSize: '44px',
                color: '#526859',
                fontFamily: 'Bodoni Moda',
                fontWeight: '400',
                marginTop: '0px',
              }}
            >
              {personas}  {personas === 1 ? 'Persona' : 'Personas'}
            </p> */}

            {/* Decoración de línea */}
            <div
              style={{
                width: '480px',
                height: '2px',
                backgroundColor: '#D4905E', // Tono cálido medio para división
                margin: '10px 0',
              }}
            />
            <h2
              style={{
                fontSize: '48px',
                fontFamily: 'Bodoni Moda',
                color: '#3D1501', // Marrón oscuro cálido consistente
                marginBottom: '0px',
                marginTop: '0px',
                fontWeight: '400',
              }}
            >
              Angie Daniela
            </h2>
            {/* Fecha como en Header */}
            {/* <p
              style={{
                fontSize: '28px',
                color: '#FEFFDB', // --on-primary-container-highlight
                fontFamily: 'Alex Brush',
                fontWeight: '400',
                letterSpacing: '2px',
                marginTop: '-10px',
              }}
            >
              Nuestra boda
            </p> */}
          </div>

          {/* Decoraciones florales en las esquinas */}
          <div
            style={{
              position: 'absolute',
              top: '60px',
              left: '60px',
              width: '40px',
              height: '40px',
              border: '2px solid #FFF8F3',
              borderRadius: '50%',
              opacity: 0.4,
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '60px',
              right: '60px',
              width: '40px',
              height: '40px',
              border: '2px solid #FFF8F3',
              borderRadius: '50%',
              opacity: 0.4,
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              left: '60px',
              width: '40px',
              height: '40px',
              border: '2px solid #FFF8F3',
              borderRadius: '50%',
              opacity: 0.4,
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              right: '60px',
              width: '40px',
              height: '40px',
              border: '2px solid #FFF8F3',
              borderRadius: '50%',
              opacity: 0.4,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Bodoni Moda',
            data: bodoniFont,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Alex Brush',
            data: alexBrushFont,
            style: 'normal',
            weight: 400,
          },
        ],
      },
    );

    // Agregar headers para evitar el cacheo
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('Vary', 'guestId');

    return response;
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
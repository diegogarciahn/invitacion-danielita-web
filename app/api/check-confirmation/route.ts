import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');
    if (!guestId) {
      return NextResponse.json({ error: 'guestId requerido' }, { status: 400 });
    }
    const invitadoRef = doc(db, 'invitados', guestId);
    const docSnap = await getDoc(invitadoRef);
    if (!docSnap.exists()) {
      return NextResponse.json({ 
        exists: false,
        confirmed: false,
        nombre: 'Invitado',
        personas: 10
      });
    }
    const data = docSnap.data();
    return NextResponse.json({ 
      exists: true,
      confirmed: !!data.Confirmada,
      nombre: data.Nombre || 'Invitado',
      personas: data.Personas || 10
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al verificar confirmación' }, { status: 500 });
  }
}

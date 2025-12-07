import { NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestId } = body;
    
    console.log('Received decline data:', body);
    
    if (!guestId) {
      return NextResponse.json({ error: 'guestId es requerido' }, { status: 400 });
    }
    
    // Actualiza el documento existente en la colección 'invitados' usando guestId como id
    const invitadoRef = doc(db, 'invitados', guestId);
    await updateDoc(invitadoRef, {
      NoAsistire: true,
      Confirmada: false,
      PersonasConfirmadas: 0,
      timestamp: Date.now(),
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al guardar la inasistencia:', error);
    return NextResponse.json({ error: 'Error al guardar la inasistencia' }, { status: 500 });
  }
}

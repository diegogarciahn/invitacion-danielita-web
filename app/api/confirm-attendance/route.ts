import { NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { app, db } from '@/firebase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestId, numberOfPeople, message, confirmed } = body;
    console.log('Received data:', body);
    if (!guestId || !numberOfPeople || typeof confirmed !== 'boolean') {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }
    // Actualiza el documento existente en la colección 'invitados' usando guestId como id
    const invitadoRef = doc(db, 'invitados', guestId);
    await updateDoc(invitadoRef, {
      Confirmada: confirmed,
      PersonasConfirmadas: numberOfPeople,
      timestamp: Date.now(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar la confirmación' }, { status: 500 });
  }
}

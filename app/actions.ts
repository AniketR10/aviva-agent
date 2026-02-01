'use server'

import { getDb, saveDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { revalidatePath } from 'next/cache';
import { addDays } from 'date-fns';

export async function resetSimulation() {
  seedDatabase();
  revalidatePath('/'); 
}

export async function advanceTime(days: number) {
  const db = getDb();
  
  // 1. Move the clock forward
  const newDate = addDays(new Date(db.virtualDate), days);
  db.virtualDate = newDate.toISOString();
  
  // 2. TODO: This is where we will hook in the "Agent Check" later
  // await runAgentCheck(db); 
  
  saveDb(db);
  revalidatePath('/');
}

export async function getDashboardData() {
  return getDb();
}
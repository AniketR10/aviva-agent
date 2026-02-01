'use server'

import { getDb, saveDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { revalidatePath } from 'next/cache';
import { addDays } from 'date-fns';
import { runAgentCycle } from '@/lib/agent';

export async function resetSimulation() {
  seedDatabase();
  revalidatePath('/'); 
}

export async function advanceTime(days: number) {
  const db = getDb();
  
  const newDate = addDays(new Date(db.virtualDate), days);
  db.virtualDate = newDate.toISOString();
  
  
  saveDb(db);
  revalidatePath('/');
}

export async function triggerAgent() {
  const db = getDb();
  
  const actionsCount = runAgentCycle(db);
  
  revalidatePath('/');
  
  return { success: true, count: actionsCount };
}

export async function getDashboardData() {
  return getDb();
}
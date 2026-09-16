// ============================================
// Meetings API Endpoints
// ============================================

import { MeetingModel } from '../models/Meeting';
import { validateMeetingCreation } from '../middleware/validator';
import { NotFoundError } from '../utils/errors';
import { logAuditEvent } from '../middleware/logger';
import type { ApiResponse, Meeting } from '../types';

export async function getAll(): Promise<ApiResponse<Meeting[]>> {
  const meetings = await MeetingModel.findAll();
  meetings.sort((a, b) => a.date.localeCompare(b.date));

  return {
    success: true,
    data: meetings,
    meta: { total: meetings.length },
  };
}

export async function create(data: any, userId: string): Promise<ApiResponse<Meeting>> {
  validateMeetingCreation(data);

  const meeting = await MeetingModel.create({
    title: data.title,
    description: data.description || '',
    date: data.date,
    time: data.time,
    duration: data.duration || 60,
    location: data.location || '',
    organizerId: userId,
    participantIds: data.participantIds || [],
    status: 'planned',
    agenda: data.agenda || [],
  });

  await logAuditEvent(userId, 'CREATE', 'meeting', meeting.id, `Created meeting: ${meeting.title}`);

  return {
    success: true,
    data: meeting,
    message: 'Совещание создано',
  };
}

export async function update(id: string, data: any, userId: string): Promise<ApiResponse<Meeting>> {
  const meeting = await MeetingModel.findById(id);
  if (!meeting) throw new NotFoundError('Совещание');

  const updated = await MeetingModel.update(id, data);
  if (!updated) throw new NotFoundError('Совещание');

  await logAuditEvent(userId, 'UPDATE', 'meeting', id, `Updated meeting: ${updated.title}`);

  return {
    success: true,
    data: updated,
    message: 'Совещание обновлено',
  };
}

export async function remove(id: string, userId: string): Promise<ApiResponse> {
  const meeting = await MeetingModel.findById(id);
  if (!meeting) throw new NotFoundError('Совещание');

  await MeetingModel.delete(id);
  await logAuditEvent(userId, 'DELETE', 'meeting', id, `Deleted meeting: ${meeting.title}`);

  return { success: true, message: 'Совещание удалено' };
}

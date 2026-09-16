// ============================================
// Meeting Model - ORM-like layer
// ============================================

import { initDatabase } from '../database/connection';
import type { Meeting } from '../types';

export class MeetingModel {
  static async findAll(): Promise<Meeting[]> {
    const db = await initDatabase();
    const tx = db.transaction('meetings', 'readonly');
    const store = tx.objectStore('meetings');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Meeting[]);
      request.onerror = () => reject(request.error);
    });
  }

  static async findById(id: string): Promise<Meeting | undefined> {
    const db = await initDatabase();
    const tx = db.transaction('meetings', 'readonly');
    const store = tx.objectStore('meetings');
    const request = store.get(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Meeting | undefined);
      request.onerror = () => reject(request.error);
    });
  }

  static async create(meetingData: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting> {
    const db = await initDatabase();
    const tx = db.transaction('meetings', 'readwrite');
    const store = tx.objectStore('meetings');
    const now = new Date().toISOString();
    const meeting: Meeting = {
      ...meetingData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
    };
    const request = store.add(meeting);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(meeting);
      request.onerror = () => reject(request.error);
    });
  }

  static async update(id: string, updates: Partial<Meeting>): Promise<Meeting | undefined> {
    const db = await initDatabase();
    const tx = db.transaction('meetings', 'readwrite');
    const store = tx.objectStore('meetings');
    const getRequest = store.get(id);
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const meeting = getRequest.result as Meeting | undefined;
        if (!meeting) { resolve(undefined); return; }
        const updatedMeeting: Meeting = {
          ...meeting,
          ...updates,
          id: meeting.id,
          updatedAt: new Date().toISOString(),
        };
        const putRequest = store.put(updatedMeeting);
        putRequest.onsuccess = () => resolve(updatedMeeting);
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  static async delete(id: string): Promise<boolean> {
    const db = await initDatabase();
    const tx = db.transaction('meetings', 'readwrite');
    const store = tx.objectStore('meetings');
    const request = store.delete(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  static async findByOrganizer(organizerId: string): Promise<Meeting[]> {
    const db = await initDatabase();
    const tx = db.transaction('meetings', 'readonly');
    const store = tx.objectStore('meetings');
    const index = store.index('organizerId');
    const request = index.getAll(organizerId);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Meeting[]);
      request.onerror = () => reject(request.error);
    });
  }

  static async findByStatus(status: string): Promise<Meeting[]> {
    const db = await initDatabase();
    const tx = db.transaction('meetings', 'readonly');
    const store = tx.objectStore('meetings');
    const index = store.index('status');
    const request = index.getAll(status);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Meeting[]);
      request.onerror = () => reject(request.error);
    });
  }

  static async findUpcoming(): Promise<Meeting[]> {
    const allMeetings = await this.findAll();
    const now = new Date().toISOString();
    return allMeetings
      .filter(m => m.status === 'planned' && m.date >= now.split('T')[0])
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

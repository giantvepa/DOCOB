// ============================================
// Database Seed - Initial Data
// ============================================

import { initDatabase } from './connection';
import { hashPassword } from '../utils/hash';
import { UserModel } from '../models/User';
import { DocumentModel } from '../models/Document';
import { TaskModel } from '../models/Task';
import { MeetingModel } from '../models/Meeting';

export async function seedDatabase(): Promise<void> {
  console.log('[Seed] Starting database seeding...');

  try {
    await initDatabase();

    // Check if already seeded
    const existingUsers = await UserModel.findAll();
    if (existingUsers.length > 0) {
      console.log('[Seed] Database already seeded, skipping...');
      return;
    }

    // Create demo users
    const adminPassword = await hashPassword('admin123');
    const managerPassword = await hashPassword('manager123');
    const userPassword = await hashPassword('user123');

    const users = [
      {
        email: 'admin@demo.tm',
        passwordHash: adminPassword,
        name: 'Аннамыратов Сердар',
        position: 'Генеральный директор',
        department: 'Руководство',
        avatar: '👔',
        role: 'admin' as const,
        isActive: true,
      },
      {
        email: 'manager@demo.tm',
        passwordHash: managerPassword,
        name: 'Мергенджанова Айгуль',
        position: 'Главный бухгалтер',
        department: 'Бухгалтерия',
        avatar: '👩‍💼',
        role: 'manager' as const,
        isActive: true,
      },
      {
        email: 'user@demo.tm',
        passwordHash: userPassword,
        name: 'Бердиев Гурбан',
        position: 'Специалист',
        department: 'IT отдел',
        avatar: '💻',
        role: 'user' as const,
        isActive: true,
      },
    ];

    for (const user of users) {
      await UserModel.create(user);
    }
    console.log('[Seed] Created', users.length, 'users');

    // Get created users
    const createdUsers = await UserModel.findAll();
    const adminUser = createdUsers.find(u => u.role === 'admin');
    const managerUser = createdUsers.find(u => u.role === 'manager');
    const regularUser = createdUsers.find(u => u.role === 'user');

    if (!adminUser || !managerUser || !regularUser) {
      throw new Error('Failed to create demo users');
    }

    // Create demo documents
    const documents = [
      {
        number: 'ВХ-2024-0156',
        title: 'Договор поставки серверного оборудования',
        description: 'Договор с ООО "ТехноСервис" на поставку серверного оборудования для модернизации ЦОД. Сумма: 2 450 000 руб.',
        type: 'incoming' as const,
        category: 'Договор',
        status: 'on_approval' as const,
        priority: 'high' as const,
        authorId: regularUser.id,
        correspondent: 'ООО "ТехноСервис"',
        dueDate: '2024-12-20',
        fileSize: 1240000,
        fileName: 'dogovor_tekhnoservis_2024.pdf',
        tags: ['поставка', 'оборудование', 'ЦОД'],
        version: 2,
      },
      {
        number: 'ИСХ-2024-0089',
        title: 'Письмо в адрес ООО "Партнёр"',
        description: 'Исходящее письмо с предложением о пролонгации договора и пересмотре условий сотрудничества.',
        type: 'outgoing' as const,
        category: 'Письмо',
        status: 'signed' as const,
        priority: 'normal' as const,
        authorId: regularUser.id,
        correspondent: 'ООО "Партнёр"',
        fileSize: 340000,
        fileName: 'pismo_partner.pdf',
        tags: ['партнёр', 'пролонгация'],
        version: 1,
      },
      {
        number: 'ВН-2024-0234',
        title: 'Служебная записка о модернизации IT',
        description: 'Обоснование необходимости модернизации серверной инфраструктуры.',
        type: 'internal' as const,
        category: 'Служебная записка',
        status: 'executed' as const,
        priority: 'high' as const,
        authorId: regularUser.id,
        fileSize: 890000,
        fileName: 'sluzhebnaya_modernizaciya.docx',
        tags: ['IT', 'модернизация'],
        version: 1,
      },
    ];

    for (const doc of documents) {
      await DocumentModel.create(doc);
    }
    console.log('[Seed] Created', documents.length, 'documents');

    // Create demo tasks
    const tasks = [
      {
        title: 'Подготовить ответ на письмо ООО "Партнёр"',
        description: 'Подготовить проект ответа до конца недели',
        status: 'in_progress' as const,
        priority: 'high' as const,
        assigneeId: regularUser.id,
        authorId: adminUser.id,
        dueDate: '2024-12-15',
      },
      {
        title: 'Проверить договор поставки оборудования',
        description: 'Юридическая экспертиза договора',
        status: 'completed' as const,
        priority: 'high' as const,
        assigneeId: managerUser.id,
        authorId: adminUser.id,
        dueDate: '2024-12-12',
        completedAt: '2024-12-11T10:00:00',
      },
      {
        title: 'Подготовить финансовое обоснование',
        description: 'Рассчитать ROI и срок окупаемости',
        status: 'new' as const,
        priority: 'normal' as const,
        assigneeId: managerUser.id,
        authorId: adminUser.id,
        dueDate: '2024-12-20',
      },
    ];

    for (const task of tasks) {
      await TaskModel.create(task);
    }
    console.log('[Seed] Created', tasks.length, 'tasks');

    // Create demo meetings
    const meetings = [
      {
        title: 'Заседание правления по итогам Q4 2024',
        description: 'Обсуждение результатов 4 квартала и планов на 2025 год',
        date: '2024-12-18',
        time: '10:00',
        duration: 120,
        location: 'Конференц-зал А',
        organizerId: adminUser.id,
        participantIds: [adminUser.id, managerUser.id, regularUser.id],
        status: 'planned' as const,
        agenda: ['Итоги Q4', 'Финансовые показатели', 'Планы на 2025'],
      },
      {
        title: 'Совещание по проекту модернизации ЦОД',
        description: 'Обсуждение хода проекта и согласование этапов',
        date: '2024-12-16',
        time: '14:00',
        duration: 60,
        location: 'Переговорная Б',
        organizerId: regularUser.id,
        participantIds: [regularUser.id, managerUser.id],
        status: 'planned' as const,
        agenda: ['Статус проекта', 'Согласование договора', 'Сроки поставки'],
      },
    ];

    for (const meeting of meetings) {
      await MeetingModel.create(meeting);
    }
    console.log('[Seed] Created', meetings.length, 'meetings');

    console.log('[Seed] Database seeding completed successfully!');
    console.log('[Seed] Demo accounts:');
    console.log('[Seed]   Admin: admin@demo.tm / admin123');
    console.log('[Seed]   Manager: manager@demo.tm / manager123');
    console.log('[Seed]   User: user@demo.tm / user123');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    throw error;
  }
}

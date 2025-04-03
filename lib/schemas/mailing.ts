import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  text, 
  timestamp, 
  integer, 
  uuid, 
  jsonb,
  varchar,
  boolean,
  pgEnum
} from 'drizzle-orm/pg-core';
import { type NotaFiscal } from './literarius';
import { type ObjetoPostal, type Remetente } from '../constants';

// Enums
export const fileTypeEnum = pgEnum('file_type', ['pdf', 'image', 'document', 'other']);
export const mailingStatusEnum = pgEnum('mailing_status', ['pending', 'processing', 'completed', 'failed']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Files table
export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  url: text('url').notNull(),
  type: fileTypeEnum('type').notNull(),
  extension: varchar('extension', { length: 10 }).notNull(),
  size: integer('size').notNull(),
  bucketFileId: varchar('bucket_file_id', { length: 255 }).notNull(),
  accountId: varchar('account_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Mailings table
export const mailings = pgTable('mailings', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  status: mailingStatusEnum('status').default('pending').notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  fileId: uuid('file_id').references(() => files.id).notNull(),
  metadata: jsonb('metadata').$type<{
    notaFiscal?: NotaFiscal;
    objetoPostal?: ObjetoPostal;
    remetente?: Remetente;
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Mailing recipients table
export const mailingRecipients = pgTable('mailing_recipients', {
  id: uuid('id').primaryKey().defaultRandom(),
  mailingId: uuid('mailing_id').references(() => mailings.id).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  cpfCnpj: varchar('cpf_cnpj', { length: 20 }),
  cep: varchar('cep', { length: 8 }),
  logradouro: varchar('logradouro', { length: 255 }),
  numero: varchar('numero', { length: 20 }),
  complemento: varchar('complemento', { length: 255 }),
  bairro: varchar('bairro', { length: 255 }),
  cidade: varchar('cidade', { length: 255 }),
  uf: varchar('uf', { length: 2 }),
  processed: boolean('processed').default(false).notNull(),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  mailings: many(mailings),
}));

export const filesRelations = relations(files, ({ many }) => ({
  mailings: many(mailings),
}));

export const mailingsRelations = relations(mailings, ({ one, many }) => ({
  user: one(users, {
    fields: [mailings.userId],
    references: [users.id],
  }),
  file: one(files, {
    fields: [mailings.fileId],
    references: [files.id],
  }),
  recipients: many(mailingRecipients),
}));

export const mailingRecipientsRelations = relations(mailingRecipients, ({ one }) => ({
  mailing: one(mailings, {
    fields: [mailingRecipients.mailingId],
    references: [mailings.id],
  }),
})); 
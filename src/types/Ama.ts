import { Ama } from '@prisma/client'

/**
 * AMA (Ask Me Anything) Question Types
 * These types define the shape of question data throughout the application
 */

/**
 * Enhanced AMA question type with typed audio waveform data
 * Overrides Prisma's JsonValue type for better TypeScript experience
 */
export type AmaQuestion = Omit<
  Ama,
  'audioWaveform' | 'createdAt' | 'updatedAt'
> & {
  audioWaveform: number[] | null // Typed array instead of generic JsonValue
  createdAt: string // ISO string instead of Date object
  updatedAt: string // ISO string instead of Date object
}

/**
 * Data structure for updating an existing AMA question
 * Used when adding answers and audio recordings
 */
export type UpdateAmaQuestion = Pick<
  AmaQuestion,
  'answer' | 'question' | 'audioUrl' | 'audioWaveform' | 'status'
>

/**
 * Response format for reaction increment operations
 * Contains minimal data needed for UI updates
 */
export type AmaReactionsResponse = Pick<Ama, 'id' | 'reactions' | 'status'>

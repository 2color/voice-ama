import { UploadApiResponse } from 'cloudinary'
import {
  AmaQuestion,
  AmaReactionsResponse,
  UpdateAmaQuestion,
} from '~/types/Ama'
import { UploadSignatureMetadata } from '~/types/Upload'
import { Visitor } from '@prisma/client'

/**
 * API client functions for AMA (Ask Me Anything) application
 * These functions handle client-server communication via REST API
 */

/**
 * Submit a new question to the AMA
 * @param question The question text to submit
 * @returns Updated list of questions
 */
export const addAMAQuestion = async (
  question: string
): Promise<AmaQuestion[]> => {
  const response = await fetch(`/api/questions`, {
    method: 'POST',
    body: JSON.stringify({ question }),
  })
  if (!response.ok) throw new Error(response.statusText)

  return response.json()
}

/**
 * Increment the reaction count for a specific question
 * @param amaId The ID of the question to react to
 * @returns Updated reaction data
 */
export const incrementAMAReactions = async (
  amaId: string
): Promise<AmaReactionsResponse> => {
  const response = await fetch(`/api/questions/${amaId}/reactions`, {
    method: 'PUT',
  })
  if (!response.ok) throw new Error(response.statusText)

  return response.json()
}

/**
 * Delete a question (admin only)
 * @param amaId The ID of the question to delete
 */
export const deleteAma = async (amaId: string): Promise<void> => {
  const response = await fetch(`/api/questions/${amaId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error(response.statusText)

  return
}

/**
 * Fetch questions by status (answered/unanswered)
 * @param answered Whether to fetch answered or unanswered questions
 * @returns List of questions matching the status
 */
export const getQuestions = async (
  answered: boolean
): Promise<AmaQuestion[]> => {
  const response = await fetch(
    `/api/questions?status=${answered ? 'ANSWERED' : 'UNANSWERED'}`,
    {
      method: 'GET',
    }
  )
  if (!response.ok) throw new Error(response.statusText)

  return response.json()
}

/**
 * Get signed upload credentials for Cloudinary
 * Used for secure audio file uploads
 * @returns Upload signature and metadata
 */
export const signUpload = async (): Promise<UploadSignatureMetadata> => {
  const response = await fetch(`/api/answers/sign`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error(response.statusText)

  return response.json()
}

/**
 * Update an existing question with answer and audio
 * @param amaId The ID of the question to update
 * @param question Updated question data including answer and audio URL
 * @returns Updated question data
 */
export const updateAMAQuestion = async (
  amaId: string,
  question: UpdateAmaQuestion
): Promise<any> => {
  const response = await fetch(`/api/questions/${amaId}`, {
    method: 'PUT',
    body: JSON.stringify({ question }),
  })
  if (!response.ok) throw new Error(response.statusText)

  return response.json()
}
/**
 * Upload audio blob to Cloudinary with signed credentials
 * Handles cross-browser compatibility by converting WebM to MP4
 * @param blob The audio blob to upload
 * @param folder Cloudinary folder path
 * @param timestamp Upload timestamp for signature validation
 * @param signature Secure upload signature
 * @returns Cloudinary upload response with audio URL
 */
export async function uploadToCloudinary(
  blob: Blob,
  folder: string,
  timestamp: string | Blob,
  signature: string
): Promise<UploadApiResponse> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`
  const formData = new FormData()

  formData.append('file', blob)
  formData.append('folder', folder)
  formData.append('signature', signature)
  formData.append('timestamp', timestamp)
  formData.append('api_key', process.env.CLOUDINARY_API_KEY)
  formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET)
  // Convert WebM (Chrome default) to MP4 for cross-browser compatibility
  formData.append('format', 'mp4')

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response.json()
}

/**
 * Get current visitor count from the server
 * Used for real-time visitor tracking
 * @returns Number of currently active visitors
 */
export const getVisitors = async (): Promise<number> => {
  const response = await fetch(`/api/visitors`, {
    method: 'GET',
  })
  if (!response.ok) throw new Error(response.statusText)

  return response.json()
}

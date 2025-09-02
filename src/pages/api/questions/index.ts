import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '~/lib/prisma'

/**
 * API route handler for /api/questions
 * Handles both creating new questions and fetching existing ones
 */
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return await createQuestion(req, res)
  }

  if (req.method === 'GET') {
    return await getQuestions(req, res)
  } else {
    return res.status(404).end()
  }
}

/**
 * Creates a new AMA question
 * POST /api/questions
 * Body: { question: string }
 */
async function createQuestion(req: NextApiRequest, res: NextApiResponse) {
  const body = JSON.parse(req.body)
  const question = body.question as string

  // Create new question with UNANSWERED status (default)
  const ama = await prisma.ama.create({
    data: {
      question,
    },
  })
  res.json(ama)
}

/**
 * Fetches questions by status
 * GET /api/questions?status=ANSWERED|UNANSWERED
 * Returns questions ordered by creation date (newest first)
 */
async function getQuestions(req: NextApiRequest, res: NextApiResponse) {
  const { status } = req.query

  if (status === 'ANSWERED' || status === 'UNANSWERED') {
    const questions = await prisma.ama.findMany({
      where: {
        status,
      },
      orderBy: {
        createdAt: 'desc', // Newest questions first
      },
    })
    res.json(questions)
  } else {
    return res
      .status(400)
      .json({ error: 'status must be ANSWERED or UNANSWERED' })
  }
}

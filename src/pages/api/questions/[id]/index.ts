import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { prisma } from 'src/lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session.isAdmin) {
    return res.status(401).end()
  }

  if (req.method === 'DELETE') {
    deleteQuestion(req, res)
  } else if (req.method === 'PUT') {
    updateQuestion(req, res)
  } else {
    res.status(404).end()
  }
}

async function deleteQuestion(req: NextApiRequest, res: NextApiResponse) {
  const amaId = req.query.id as string
  try {
    const ama = await prisma.ama.delete({
      where: {
        id: amaId,
      },
    })
    return res.status(204).json({ id: ama.id })
  } catch (e) {
    console.log(e)
    res.status(500)
  }
}

async function updateQuestion(req: NextApiRequest, res: NextApiResponse) {
  const amaId = req.query.id as string
  const { question } = JSON.parse(req.body)
  try {
    const ama = await prisma.ama.update({
      where: {
        id: amaId,
      },
      data: {
        question: question.question,
        answer: question.answer,
        status: question.status,
        audioUrl: question.audioUrl ?? null,
        audioWaveform: Array.isArray(question.audioWaveform)
          ? question.audioWaveform
          : Prisma.DbNull,
      },
    })

    return res.status(200).json(ama)
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

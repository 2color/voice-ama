import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const amaId = req.query.id as string
  if (req.method === 'PUT') {
    const ama = await prisma.ama.update({
      where: {
        id: amaId,
      },
      data: {
        reactions: {
          increment: 1,
        },
      },
    })
    res.json({ id: ama?.id, reactions: ama?.reactions, status: ama?.status })
  } else {
    return res.status(404).end()
  }
}

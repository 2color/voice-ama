import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import cloudinary from '~/lib/cloudinary'

const {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_BASE_PATH,
} = process.env

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if (req.method !== 'POST') {
  //   res.statusCode = 200
  //   return
  // }
  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session.isAdmin) {
      return res.status(401).end()
    }
    const timeNow = new Date().getTime()
    const { signature, folder, timestamp } = signUploadRequest(
      timeNow,
      `${CLOUDINARY_BASE_PATH}`
    )
    return res.status(200).json({ folder, signature, timestamp })
  } catch (error) {
    return res.status(500).end()
  }
}

function signUploadRequest(timestamp: number, folder: string) {
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      // Sign upload request with transformation to mp4 for cross-browser playing compatibility
      format: 'mp4',
      timestamp,
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
      folder,
    },
    CLOUDINARY_API_SECRET as string
  )

  return { signature, folder, timestamp }
}

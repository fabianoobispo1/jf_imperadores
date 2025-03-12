import { NextResponse } from 'next/server'
import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()
export async function POST(request: Request) {
  const { imageKey } = await request.json()
  try {
    const res = await utapi.deleteFiles(imageKey)
    return NextResponse.json(res)
  } catch (error) {
    console.log(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

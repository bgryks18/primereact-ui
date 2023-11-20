import { promises as fs } from 'fs'

export async function GET() {
  return Response.json({ message: 'hiii' })
}

export async function POST(req: Request) {
  const newProducts = await req.json()

  try {
    const { products } = newProducts
    await fs.writeFile(
      process.cwd() + '/app/data/product.json',
      JSON.stringify(products)
    )

    return Response.json({ message: 'Updated' }, { status: 200 })
  } catch (e) {
    return Response.json({ message: 'An error occured', e }, { status: 400 })
  }
}

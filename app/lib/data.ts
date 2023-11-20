import { unstable_noStore as noStore } from 'next/cache'
import { promises as fs } from 'fs'

export async function fetchProducts() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore()
  try {
    const data = await fs.readFile(
      process.cwd() + '/app/data/product.json',
      'utf8'
    )
    return { data: JSON.parse(data) }
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to fetch revenue data.')
  }
}

export async function fetchCategories() {
  try {
    const data = await fs.readFile(
      process.cwd() + '/app/data/category.json',
      'utf8'
    )
    return { data: JSON.parse(data) }
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to fetch revenue data.')
  }
}

export async function fetchProductSettings() {
  try {
    const data = await fs.readFile(
      process.cwd() + '/app/data/setting.json',
      'utf8'
    )
    return { data: JSON.parse(data) }
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to fetch revenue data.')
  }
}

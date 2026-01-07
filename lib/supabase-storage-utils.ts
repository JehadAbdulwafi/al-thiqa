import { createServerSupabaseClient } from './supabase-server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

export function getImagePathFromUrl(url: string | null): string | null {
  if (!url) return null

  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname

    const parts = pathname.split('/')
    const fileName = parts[parts.length - 1]

    if (fileName && fileName.includes('.')) {
      return fileName
    }

    return null
  } catch {
    return null
  }
}

export function getStorageBucketPath(entityType: string): string {
  const paths: Record<string, string> = {
    blog: 'public/blog',
    collection: 'public',
    product: 'public/products',
    banner: 'public/banners',
  }

  return paths[entityType] || '/public'
}

export async function deleteImageFromStorage(url: string | null, basePath: string): Promise<boolean> {
  if (!url) return true

  const fileName = getImagePathFromUrl(url)
  if (!fileName) return false

  try {
    const supabase = await createServerSupabaseClient()
    const filePath = basePath ? `${basePath}/${fileName}` : fileName
    const { data: dataexists, error: errorexists } = await supabase.storage
      .from('images')
      .exists(filePath)

    console.log("deleteImageFromStorage exists", dataexists, errorexists, filePath)

    const { data, error } = await supabase.storage
      .from('images')
      .remove([filePath])
    console.log("deleteImageFromStorage", data, error)

    if (error) {
      console.error('Failed to delete image from storage:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting image from storage:', error)
    return false
  }
}

export async function deleteMultipleImagesFromStorage(urls: string[], basePath: string): Promise<void> {
  const fileNames = urls
    .map(getImagePathFromUrl)
    .filter((name): name is string => name !== null)

  if (fileNames.length === 0) return

  try {
    const supabase = await createServerSupabaseClient()
    const filePaths = basePath
      ? fileNames.map(name => `${basePath}/${name}`)
      : fileNames

    const { error } = await supabase.storage
      .from('images')
      .remove(filePaths)

    if (error) {
      console.error('Failed to delete multiple images from storage:', error)
    }
  } catch (error) {
    console.error('Error deleting multiple images from storage:', error)
  }
}

export async function deleteOldImageIfChanged(
  oldUrl: string | null | undefined,
  newUrl: string | null | undefined,
  basePath: string
): Promise<void> {
  console.log(`oldUrl: ${oldUrl}, newUrl: ${newUrl}, basePath: ${basePath}`)
  if (!oldUrl || oldUrl === newUrl) return

  await deleteImageFromStorage(oldUrl, basePath)
}

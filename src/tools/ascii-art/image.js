import { MAX_FILE_MB, rowsFor } from './ascii.js'

// Pictures with more pixels than this are refused, so a huge file cannot freeze the page.
const MAX_PIXELS = 100_000_000

/** Opens an image file. Resolves to the decoded picture (an ImageBitmap) or throws an Error with a message to show. */
export async function openImage(file) {
    if (file.size > MAX_FILE_MB * 1024 * 1024) throw new Error(`That file is larger than ${MAX_FILE_MB} MB.`)
    let bitmap
    try {
        bitmap = await createImageBitmap(file)
    } catch {
        throw new Error('This image could not be read. Try a PNG, JPG, WebP, or GIF file.')
    }
    if (bitmap.width * bitmap.height > MAX_PIXELS) {
        bitmap.close()
        throw new Error('That picture has too many pixels. Try a smaller one.')
    }
    return bitmap
}

/** Draws the picture at `columns` x rows and returns its pixels (RGBA), ready for pixelsToAscii. */
export function samplePixels(bitmap, columns) {
    const rows = rowsFor(bitmap.width, bitmap.height, columns)
    const canvas = document.createElement('canvas')
    canvas.width = columns
    canvas.height = rows
    const context = canvas.getContext('2d', { willReadFrequently: true })
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(bitmap, 0, 0, columns, rows)
    return { data: context.getImageData(0, 0, columns, rows).data, rows }
}
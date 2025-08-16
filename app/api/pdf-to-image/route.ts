// Example using pdf2pic (Node.js)
import pdf2pic from 'pdf2pic'

export default async function handler(req, res) {
  try {
    const { pdfUrl, page = 1, quality = 'high' } = req.body
    
    const convert = pdf2pic.fromURL(pdfUrl, {
      density: quality === 'high' ? 300 : 150,
      saveFilename: "page",
      savePath: "/tmp",
      format: "png",
      width: 794,
      height: 1123
    })
    
    const result = await convert(page)
    
    res.json({
      imageUrl: result.path,
      totalPages: result.totalPages
    })
  } catch (error) {
    res.status(500).json({ error: 'Conversion failed' })
  }
}
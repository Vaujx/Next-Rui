import { YtDlp } from 'ytdlp-nodejs';

const ytdlp = new YtDlp();  // Initialize globally (binary downloads on first use)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Optional: Download FFmpeg if needed (for merging formats)
    await ytdlp.downloadFFmpeg();

    // Get video info to extract title for filename
    const info = await ytdlp.getInfoAsync(url);
    const title = info.title || 'video';
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;  // Sanitize filename

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Stream the video (best quality with audio/video merged)
    const videoStream = ytdlp.stream(url, {
      format: 'bestvideo+bestaudio/best',  // Merge best video + audio
      onProgress: (progress) => {
        console.log('Download progress:', progress);  // Log for Vercel debugging
      },
    });

    videoStream.pipe(res);

    videoStream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: `Stream error: ${error.message}` });
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: `Error downloading video: ${error.message}` });
  }
}

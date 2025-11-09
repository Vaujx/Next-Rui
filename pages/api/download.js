import ytdl from 'ytdl-core';
import { Readable } from 'stream';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
    if (!format) {
      throw new Error('No suitable format found');
    }

    const filename = `${info.videoDetails.title}.${format.container}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', format.mimeType);

    const videoStream = ytdl.downloadFromInfo(info, { format });
    videoStream.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: `Error downloading video: ${error.message}` });
  }
}
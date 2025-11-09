import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [previewSrc, setPreviewSrc] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Downloading...');
    setPreviewSrc(null);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'video.mp4';
      const downloadUrl = URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Set preview
      setPreviewSrc(downloadUrl);

      setStatus('Download complete!');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Head>
        <title>RUI Downloader</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <style jsx global>{`
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .warning {
          font-size: 14px;
          color: #d9534f;
          margin-bottom: 20px;
        }
        input[type="text"] {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        button {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #0056b3;
        }
        #status {
          margin-top: 10px;
          color: #555;
          min-height: 20px;
        }
        .loader {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 20px;
        }
        .loader div {
          position: absolute;
          top: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #007bff;
          animation-timing-function: cubic-bezier(0, 1, 1, 0);
        }
        .loader div:nth-child(1) {
          left: 8px;
          animation: loader1 0.6s infinite;
        }
        .loader div:nth-child(2) {
          left: 8px;
          animation: loader2 0.6s infinite;
        }
        .loader div:nth-child(3) {
          left: 32px;
          animation: loader2 0.6s infinite;
        }
        .loader div:nth-child(4) {
          left: 56px;
          animation: loader3 0.6s infinite;
        }
        @keyframes loader1 {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes loader3 {
          0% { transform: scale(1); }
          100% { transform: scale(0); }
        }
        @keyframes loader2 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(24px, 0); }
        }
        #preview {
          margin-top: 20px;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          background: #f9f9f9;
        }
        #preview video {
          width: 100%;
          max-height: 300px;
        }
      `}</style>
      <div className="container">
        <h1>RUI Downloader</h1>
        <p className="warning">Warning: Use this tool responsibly. Ensure you have the legal right to download and use the content. Respect copyrights and terms of service.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL here"
            required
          />
          <button type="submit">Download</button>
        </form>
        <div id="status">
          {status.startsWith('Downloading') && (
            <>
              Downloading... <div className="loader"><div></div><div></div><div></div><div></div></div>
            </>
          )}
          {!status.startsWith('Downloading') && status}
        </div>
        {previewSrc && (
          <div id="preview">
            <h2>Video Preview</h2>
            <video src={previewSrc} controls />
          </div>
        )}
      </div>
    </>
  );
}
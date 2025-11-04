import React, { useEffect, useRef, useState } from 'react';
import { Download, Video } from 'lucide-react';

export default function ExportPanel({ captureRef, onStartRecording, onStopRecording, isPlaying }) {
  const [isRecording, setIsRecording] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const el = captureRef?.current;
    if (!el || !el.captureStream) {
      alert('Recording not supported in this environment. Try a Chromium-based browser.');
      return;
    }
    const stream = el.captureStream(30);
    const mr = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    chunksRef.current = [];
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      setIsRecording(false);
      onStopRecording?.();
    };
    mediaRecorderRef.current = mr;
    mr.start();
    setIsRecording(true);
    onStartRecording?.();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const download = () => {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'jk-district-animation.webm';
    a.click();
  };

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  return (
    <div className="mx-auto mt-6 w-full max-w-6xl rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <Video size={18} />
          <span className="text-sm">Export</span>
          <span className="text-xs text-slate-500">Record preview as WebM</span>
        </div>

        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button onClick={startRecording} className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">
              <Video size={16} />
              Start Recording
            </button>
          ) : (
            <button onClick={stopRecording} className="inline-flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600">
              <Video size={16} />
              Stop & Save
            </button>
          )}

          <button
            onClick={download}
            disabled={!blobUrl}
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-slate-200 enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

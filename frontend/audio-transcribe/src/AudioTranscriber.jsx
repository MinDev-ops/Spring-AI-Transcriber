import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileAudio, Loader2, Copy } from 'lucide-react';
import styles from './AudioTranscriber.module.css';

const AudioTranscriber = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const fileInputRef = useRef(null);


    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', transcription);

        try {
            const response = await axios.post('http://localhost:8080/api/transcriptions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setTranscription(response.data.transcription);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Transcribe Audio to Text</h1>
        <p>Transcribe speech and voice recordings to text in no time with our AI audio-to-text converter.</p>
      </header>

      {!transcription && !isProcessing && (
        <div className={styles.dropZone}>
          <div className={styles.uploadContent}>
            {/* Minimalist Icon Stack */}
            <div className={styles.iconGroup}>
              <div className="opacity-40"><FileAudio size={40} /></div>
            </div>

            <p style={{fontSize: '1.1rem', fontWeight: '500'}}>
              Choose your file or just drag and drop it here.
            </p>

            <button className={styles.uploadButton} onClick={() => fileInputRef.current.click()}>
              <UploadCloud size={20} />
              Upload file
            </button>

            <p className={styles.subText}>
              Add audio or video files with spoken audio. Max file size: 2GB
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              style={{ display: 'none' }}
              accept="audio/*,video/*"
            />
          </div>
        </div>
      )}

      {isProcessing && (
        <div className={styles.dropZone}>
          <Loader2 className="animate-spin text-purple-500" size={48} />
          <p className="mt-4 text-zinc-400">Processing your waves...</p>
        </div>
      )}

      {transcription && !isProcessing && (
        <div className={styles.resultContainer}>
          <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Transcription Ready</span>
            <button
              className="text-zinc-400 hover:text-white transition-colors"
              onClick={() => {setTranscription("");}}
            >
              Start New
            </button>
          </div>
          <p className={styles.transcriptionText}>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default AudioTranscriber;

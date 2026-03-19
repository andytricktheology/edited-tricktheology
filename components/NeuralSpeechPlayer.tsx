
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

interface NeuralSpeechPlayerProps {
  text: string;
  title: string;
}

const NeuralSpeechPlayer: React.FC<NeuralSpeechPlayerProps> = ({ text, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const initiateBroadcast = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    try {
      setIsLoading(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const cleanContent = stripHtml(text).substring(0, 3000); // Guard rails for length
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Read this theological insight titled "${title}" naturally: ${cleanContent}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("Audio signal lost.");

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContextRef.current);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => setIsPlaying(false);
      sourceNodeRef.current = source;
      
      source.start();
      setIsPlaying(true);
    } catch (err) {
      console.error("Speech failure:", err);
      alert("Neural link failed. Please retry signal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={initiateBroadcast}
        disabled={isLoading}
        className={`group relative flex items-center gap-3 px-6 py-3 rounded-2xl font-orbitron font-bold text-[10px] tracking-widest uppercase transition-all overflow-hidden ${
          isPlaying 
            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
            : 'bg-brand-start/10 text-brand-start border border-brand-start/30 hover:bg-brand-start hover:text-white'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-start animate-ping"></span>
            DECRYPTING SIGNAL...
          </div>
        ) : isPlaying ? (
          <>
            <div className="flex gap-0.5 h-3 items-end">
              <div className="w-0.5 bg-red-400 animate-[bounce_0.6s_infinite]"></div>
              <div className="w-0.5 bg-red-400 animate-[bounce_0.8s_infinite]"></div>
              <div className="w-0.5 bg-red-400 animate-[bounce_0.5s_infinite]"></div>
            </div>
            STOP BROADCAST
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            Neural Broadcast
          </>
        )}
      </button>
    </div>
  );
};

export default NeuralSpeechPlayer;

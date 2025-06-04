// src/components/shared/YouTubePlayer.tsx
import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface YouTubePlayerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  videoId, 
  isOpen, 
  onClose,
  title = 'Видео'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок и кнопка закрытия */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-lg">{title}</h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            {/* YouTube iframe */}
            <div className="relative pt-[56.25%]"> {/* 16:9 соотношение сторон */}
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
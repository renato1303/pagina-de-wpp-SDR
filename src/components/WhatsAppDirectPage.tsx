import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, Sparkles
} from 'lucide-react';
import { LeadData, IntegrationConfig } from '../types';
import { buildWhatsAppMessage, calculateLeadScore } from '../data';

interface WhatsAppDirectPageProps {
  lead: LeadData;
  onWhatsAppClick?: (leadData: LeadData, targetNumber: string, whatsappUrl: string) => void;
}

export default function WhatsAppDirectPage({ lead, onWhatsAppClick }: WhatsAppDirectPageProps) {
  const [whatsappNumber, setWhatsappNumber] = useState('5515981669784');
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    const storedConfig = localStorage.getItem('sensesales_integrations_config');
    if (storedConfig) {
      try {
        const config: IntegrationConfig = JSON.parse(storedConfig);
        if (config.whatsappNumber && config.whatsappNumber !== '5511999999999') {
          setWhatsappNumber(config.whatsappNumber);
        }
      } catch (err) {
        console.error('Error reading whatsapp number from config:', err);
      }
    }
  }, []);

  const score = lead.leadScore ?? calculateLeadScore(lead);
  const cleanPhone = whatsappNumber.replace(/\D/g, '') || '5515981669784';
  const encodedMsg = buildWhatsAppMessage({ ...lead, leadScore: score });
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  const handleOpenWhatsApp = () => {
    setHasClicked(true);

    if (onWhatsAppClick) {
      onWhatsAppClick(lead, cleanPhone, whatsappUrl);
    }

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 text-left font-sans" id="whatsapp-direct-page">
      
      {/* Top Banner & Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel rounded-[28px] p-6 sm:p-10 bg-white border border-gray-200 shadow-sm relative overflow-hidden text-center space-y-6"
      >
        <div className="space-y-3 max-w-lg mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#25D366]/10 text-[#0f8b3c] border border-[#25D366]/20 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Formulário Preenchido
          </span>
          
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 tracking-tight leading-tight">
            Última etapa! Clique no botão abaixo para confirmar seus dados com nosso time
          </h1>
          

        </div>

        {/* Primary Call-to-action Button */}
        <div className="pt-2 max-w-md mx-auto space-y-4">
          <div className="relative group">
            {/* Animated background glow halo */}
            <motion.div
              animate={{
                scale: [1, 1.04, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-1 rounded-2xl bg-[#25D366] opacity-50 blur-md pointer-events-none"
            />

            <motion.button
              onClick={handleOpenWhatsApp}
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-4 sm:py-5 px-6 sm:px-8 bg-[#25D366] hover:bg-[#20ba5a] text-white font-display font-bold text-lg sm:text-xl tracking-wide rounded-2xl shadow-xl shadow-[#25D366]/30 transition-colors cursor-pointer flex items-center justify-center text-center overflow-hidden"
              id="btn-open-whatsapp"
            >
              {/* Subtle shimmer effect passing across the button */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none"
              />

              <span className="relative z-10">Clique aqui para falar com nosso time</span>
            </motion.button>
          </div>

          {hasClicked && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 space-y-1"
            >
              <div className="flex items-center justify-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Conversa iniciada!</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Se a janela do WhatsApp não abriu automaticamente,{' '}
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold underline text-emerald-900"
                >
                  clique aqui para abrir manualmente
                </a>.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

    </div>
  );
}



export class VoiceNarrator {
    private synth: SpeechSynthesis;
    private voice: SpeechSynthesisVoice | null = null;
    private rate: number = 1.0;
    private isEnabled: boolean = true;
    private currentUtterance: SpeechSynthesisUtterance | null = null;

    constructor() {
        this.synth = window.speechSynthesis;
        // Try to load immediately
        this.loadVoices();
        
        // Add listener for async voice loading (Chrome/Safari)
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
    }

    private loadVoices = () => {
        const voices = this.synth.getVoices();
        if (voices.length > 0) {
            // Prefer a natural sounding English voice
            this.voice = voices.find(v => v.name.includes('Google US English')) || 
                         voices.find(v => v.lang === 'en-US') || 
                         voices[0];
        }
    };

    public speak(text: string, onEnd?: () => void): void {
        if (!this.isEnabled) {
            // If muted, simulate the duration of the speech so auto-advance still works
            if (onEnd) setTimeout(onEnd, text.length * 50); 
            return;
        }

        // 1. Cancel existing speech. 
        // Important: Remove onend from current utterance to prevent double-skipping
        // if we are interrupting manually.
        if (this.currentUtterance) {
            this.currentUtterance.onend = null;
        }
        this.synth.cancel();

        // 2. Refresh voices if missing (sometimes getVoices returns empty initially)
        if (!this.voice) {
            this.loadVoices();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        if (this.voice) utterance.voice = this.voice;
        utterance.rate = this.rate;
        utterance.pitch = 1.0;
        
        // 3. Attach new onEnd
        if (onEnd) {
            utterance.onend = () => {
                this.currentUtterance = null;
                onEnd();
            };
        }

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
    }

    public cancel(): void {
        if (this.currentUtterance) {
            this.currentUtterance.onend = null;
            this.currentUtterance = null;
        }
        this.synth.cancel();
    }

    public setRate(rate: number): void {
        this.rate = rate;
    }

    public toggle(enabled: boolean): void {
        this.isEnabled = enabled;
        if (!enabled) this.cancel();
    }
}

export const voiceService = new VoiceNarrator();

/**
 * AudioManager - Handles all audio-related functionality
 * 
 * This class is responsible for loading, playing, and managing sound effects
 * using the Web Audio API.
 */
export default class AudioManager {
    constructor() {
        this.context = null;
        this.sounds = {
            navigate: null,
            select: null,
            back: null
        };
        this.initialized = false;
    }

    /**
     * Initialize the Web Audio API context and load sounds
     */
    async init() {
        try {
            // Create audio context
            this.context = new window.AudioContext;

            // Create simple sounds using oscillators
            this.createNavigationSound();
            this.createSelectSound();
            this.createBackSound();

            this.initialized = true;
            console.log("Audio system initialized");
        } catch (error) {
            console.error("Error initializing audio:", error);
        }
    }

    /**
     * Create a navigation sound (when moving between menu items)
     */
    createNavigationSound() {
        // This will be a simple tonal sweep for navigation
        this.sounds.navigate = () => {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(900, this.context.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.2);
        };
    }

    /**
     * Create a select sound (when confirming a selection)
     */
    createSelectSound() {
        // This will be a more affirming sound for selection
        this.sounds.select = () => {
            const oscillator1 = this.context.createOscillator();
            const oscillator2 = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator1.type = 'sine';
            oscillator1.frequency.setValueAtTime(440, this.context.currentTime);
            oscillator1.frequency.exponentialRampToValueAtTime(880, this.context.currentTime + 0.1);

            oscillator2.type = 'triangle';
            oscillator2.frequency.setValueAtTime(660, this.context.currentTime + 0.1);
            oscillator2.frequency.exponentialRampToValueAtTime(990, this.context.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator1.start();
            oscillator2.start(this.context.currentTime + 0.1);
            oscillator1.stop(this.context.currentTime + 0.1);
            oscillator2.stop(this.context.currentTime + 0.3);
        };
    }

    /**
     * Create a back/cancel sound
     */
    createBackSound() {
        // This will be a declining tone for going back
        this.sounds.back = () => {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(700, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, this.context.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.3);
        };
    }

    /**
     * Play a sound by its name
     * @param {string} soundName - The name of the sound to play
     */
    playSound(soundName) {
        if (!this.initialized) {
            console.warn("Audio not yet initialized");
            return;
        }

        if (this.sounds[soundName]) {
            // Resume audio context if suspended (browser autoplay policy)
            if (this.context.state === 'suspended') {
                this.context.resume();
            }

            this.sounds[soundName]();
        }
    }
}
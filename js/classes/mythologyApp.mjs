import DataManager from "./dataManager.mjs";
import AudioManager from "./audioManager.mjs";
import MenuSystem from "./menuSystem.mjs";

/**
 * MythologyApp - Main application class for the Mythology Gods Menu
 * 
 * This class handles the overall application state and initialization.
 */
export default class MythologyApp {
    constructor() {
        // Initialize sub-systems
        this.dataManager = new DataManager();
        this.audioManager = new AudioManager();
        this.menuSystem = new MenuSystem(this.audioManager);

        // Load data and start the app
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Load the gods data
            await this.dataManager.loadGods();

            // Initialize the menu with the loaded data
            this.menuSystem.initializeMenu(this.dataManager.gods);

            // Initialize audio
            await this.audioManager.init();

            console.log("Mythology App initialized successfully");
        } catch (error) {
            console.error("Error initializing application:", error);
        }
    }
}
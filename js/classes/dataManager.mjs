/**
 * DataManager - Handles data loading and management
 * 
 * This class is responsible for loading and providing access to the gods data.
 */
export default class DataManager {
    constructor() {
        this.gods = [];
    }

    /**
     * Load gods data from our JSON dataset
     */
    async loadGods() {
        this.gods = await fetch("data/gods.json").then(r => r.json());
        console.log("Gods data loaded:", this.gods.length, "gods");
    }

    /**
     * Get a specific god by ID
     * @param {number} id - The ID of the god to retrieve
     * @returns {Object|null} - The god object or null if not found
     */
    getGodById(id) {
        return this.gods.find(god => god.id === id) || null;
    }
}
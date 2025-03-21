/**
 * MenuSystem - Handles menu navigation and interaction
 * 
 * This class manages the carousel menu interface, keyboard controls,
 * and item selection.
 */
export default class MenuSystem {
    constructor(audioManager) {
        this.audioManager = audioManager;
        this.currentIndex = 0;
        this.gods = [];
        this.isDetailView = false;
        this.carouselElement = document.getElementById('godsCarousel');
        this.infoSection = document.getElementById('infoSection');

        // Configuration
        this.itemsCount = 0;
        this.angleStep = 0;
        this.radius = 400; // Distance of items from center

        // Bind event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);

        // Add event listeners
        document.addEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Initialize the menu with gods data
     * @param {Array} gods - The array of god objects
     */
    initializeMenu(gods) {
        this.gods = gods;
        this.itemsCount = gods.length;
        this.angleStep = (2 * Math.PI) / this.itemsCount;
        this.renderMenu();
        this.updateCarousel();
    }

    /**
     * Render the initial menu items
     */
    renderMenu() {
        this.carouselElement.innerHTML = '';

        this.gods.forEach((god, index) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.dataset.id = god.id;
            menuItem.dataset.index = index;

            menuItem.innerHTML = `
                        <img src="${god.imageUrl}" alt="${god.name}">
                        <h3>${god.name}</h3>
                        <p>${god.pantheon} Pantheon</p>
                    `;

            this.carouselElement.appendChild(menuItem);
        });

        // Initial positioning of items
        this.updateCarousel();
    }

    /**
     * Update the carousel based on the current index
     */
    updateCarousel() {
        const items = document.querySelectorAll('.menu-item');

        // Remove active class from all items
        items.forEach(item => {
            item.classList.remove('active');

            // Keep the selected class if in detail view
            if (!this.isDetailView) {
                item.classList.remove('selected');
            }
        });

        if (this.isDetailView) {
            // Show details for selected god
            this.showGodDetails(this.gods[this.currentIndex]);

            // Apply selected class to the current item for floating animation
            items[this.currentIndex].classList.add('selected');
        } else {
            // Position each item in 3D space
            items.forEach((item, index) => {
                // Calculate item's angle position - adjusted by currentIndex to rotate carousel
                const itemAngle = this.angleStep * index - (this.angleStep * this.currentIndex);

                // Calculate 3D position
                const x = Math.sin(itemAngle) * this.radius;
                const z = Math.cos(itemAngle) * this.radius - this.radius; // Offset to position in front

                // Apply transformation
                item.style.transform = `translateX(-50%) translateZ(${z}px) translateX(${x}px)`;

                // Adjust opacity based on position (items further back are more transparent)
                const normalizedZ = (z + this.radius) / (this.radius * 2);
                item.style.opacity = 0.3 + (normalizedZ * 0.7);
            });

            // Highlight the current item
            items[this.currentIndex].classList.add('active');
            items[this.currentIndex].style.opacity = '1';

            // Hide details section
            this.infoSection.classList.remove('visible');
        }
    }

    /**
     * Shows detailed information about a god
     * @param {Object} god - The god object to display
     */
    showGodDetails(god) {
        this.infoSection.innerHTML = `
                    <h3>${god.name}</h3>
                    <p><strong>Pantheon:</strong> ${god.pantheon}</p>
                    <p><strong>Domains:</strong> ${god.domain}</p>
                    <p>${god.description}</p>
                `;

        this.infoSection.classList.add('visible');
    }

    /**
     * Navigate to the next item in the menu
     */
    navigateNext() {
        if (this.isDetailView) return;

        this.audioManager.playSound('navigate');
        this.currentIndex = (this.currentIndex + 1) % this.gods.length;
        this.updateCarousel();
    }

    /**
     * Navigate to the previous item in the menu
     */
    navigatePrevious() {
        if (this.isDetailView) return;

        this.audioManager.playSound('navigate');
        this.currentIndex = (this.currentIndex - 1 + this.gods.length) % this.gods.length;
        this.updateCarousel();
    }

    /**
     * Select the current menu item
     */
    selectItem() {
        if (this.isDetailView) return;

        this.audioManager.playSound('select');
        this.isDetailView = true;

        // First update the carousel to show details
        this.updateCarousel();

        // Select the item with specific CSS class for the floating animation
        const items = document.querySelectorAll('.menu-item');
        items[this.currentIndex].classList.add('selected');
    }

    /**
     * Go back from detail view to menu
     */
    goBack() {
        if (!this.isDetailView) return;

        this.audioManager.playSound('back');
        this.isDetailView = false;
        this.updateCarousel();
    }

    /**
     * Handle keyboard input
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowLeft':
                this.navigatePrevious();
                event.preventDefault();
                break;

            case 'ArrowRight':
                this.navigateNext();
                event.preventDefault();
                break;

            case 'Enter':
                this.selectItem();
                event.preventDefault();
                break;

            case 'Backspace':
                this.goBack();
                event.preventDefault();
                break;
        }
    }
}
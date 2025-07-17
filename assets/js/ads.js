// Система ротации рекламных блоков
class AdRotator {
    constructor() {
        this.ads = [];
        this.currentIndex = 0;
        this.interval = null;
        this.container = null;
        this.init();
    }

    init() {
        // Получаем данные из script тега
        const adsScript = document.getElementById('adsDataScript');
        if (!adsScript) return;

        try {
            const data = JSON.parse(adsScript.textContent);
            this.ads = data.advertisements || [];
            this.settings = data.rotation || {};
        } catch (e) {
            console.error('Error parsing ads data:', e);
            return;
        }

        // Находим контейнер для рекламы
        this.container = document.getElementById('ad-placeholder');
        if (!this.container) return;

        // Создаем структуру рекламного блока
        this.createAdStructure();
        
        // Запускаем ротацию
        this.startRotation();
    }

    createAdStructure() {
        this.container.innerHTML = `
            <div class="ad-container">
                <div class="ad-header">Рекомендуемые проекты</div>
                <div class="ad-grid" id="ad-grid"></div>
            </div>
        `;
        
        this.adGrid = document.getElementById('ad-grid');
    }

    getRandomAds(count = 3) {
        const shuffled = [...this.ads].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, this.ads.length));
    }

    renderAds(adsToShow) {
        if (!this.adGrid) return;

        this.adGrid.innerHTML = adsToShow.map(ad => `
            <a href="${ad.url}" target="_blank" rel="noopener noreferrer" class="ad-item">
                <div class="ad-item-header">
                    <span class="ad-item-icon">${ad.icon}</span>
                    <h4 class="ad-item-title">${ad.title}</h4>
                </div>
                <p class="ad-item-description">${ad.description}</p>
                <span class="ad-item-url">${ad.url}</span>
            </a>
        `).join('');
    }

    rotateAds() {
        const maxVisible = this.settings.max_visible || 3;
        const adsToShow = this.getRandomAds(maxVisible);
        this.renderAds(adsToShow);
    }

    startRotation() {
        // Показываем первую ротацию
        this.rotateAds();

        // Запускаем интервал если включена ротация
        if (this.settings.interval && this.settings.interval > 0) {
            this.interval = setInterval(() => {
                this.rotateAds();
            }, this.settings.interval);
        }
    }

    stopRotation() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    new AdRotator();
});
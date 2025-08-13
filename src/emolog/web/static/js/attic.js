/**
 * Emolog Attic Dashboard - Interactive Features
 * Making the emotional attic come alive
 */

class EmotionalAttic {
    constructor() {
        this.currentMood = window.currentMood || 'peaceful';
        this.isRefreshing = false;
        this.init();
    }

    init() {
        this.setupWindowEffects();
        this.setupDataRefresh();
        this.setupInteractiveElements();
        console.log('🏠 Welcome to your emotional attic!');
    }

    setupWindowEffects() {
        const windowScene = document.getElementById('windowScene');
        if (!windowScene) return;

        // Add subtle parallax effect to window
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            windowScene.style.transform = `translateY(${rate}px)`;
        });

        // Window breathing effect for peaceful moments
        if (this.currentMood === 'peaceful') {
            this.addBreathingEffect();
        }

        // Dynamic weather effects
        this.addWeatherEffects();
    }

    addBreathingEffect() {
        const windowContent = document.querySelector('.window-content');
        if (!windowContent) return;

        windowContent.style.animation = 'breathe 6s ease-in-out infinite';
        
        // Add CSS animation if not exists
        if (!document.querySelector('#breatheAnimation')) {
            const style = document.createElement('style');
            style.id = 'breatheAnimation';
            style.textContent = `
                @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.02); opacity: 0.95; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addWeatherEffects() {
        const weatherLayer = document.querySelector('.weather-layer');
        if (!weatherLayer) return;

        switch (this.currentMood) {
            case 'sunny':
                this.addSunbeams(weatherLayer);
                break;
            case 'storm':
                this.addLightning(weatherLayer);
                break;
            case 'foggy':
                this.addFogEffect(weatherLayer);
                break;
        }
    }

    addSunbeams(container) {
        const sunbeam = document.createElement('div');
        sunbeam.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(
                ellipse at center,
                transparent 30%,
                rgba(255, 255, 255, 0.1) 50%,
                transparent 70%
            );
            animation: rotateSun 20s linear infinite;
            pointer-events: none;
        `;
        
        if (!document.querySelector('#sunAnimation')) {
            const style = document.createElement('style');
            style.id = 'sunAnimation';
            style.textContent = `
                @keyframes rotateSun {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        container.appendChild(sunbeam);
    }

    addLightning(container) {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                const flash = document.createElement('div');
                flash.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.8);
                    pointer-events: none;
                    animation: lightning 0.2s ease-out;
                `;
                
                if (!document.querySelector('#lightningAnimation')) {
                    const style = document.createElement('style');
                    style.id = 'lightningAnimation';
                    style.textContent = `
                        @keyframes lightning {
                            0%, 100% { opacity: 0; }
                            50% { opacity: 1; }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                container.appendChild(flash);
                setTimeout(() => flash.remove(), 200);
            }
        }, 3000);
    }

    addFogEffect(container) {
        const fog = document.createElement('div');
        fog.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
            animation: fogMove 15s ease-in-out infinite;
            pointer-events: none;
        `;
        
        if (!document.querySelector('#fogAnimation')) {
            const style = document.createElement('style');
            style.id = 'fogAnimation';
            style.textContent = `
                @keyframes fogMove {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    33% { transform: translateX(10px) translateY(-5px); }
                    66% { transform: translateX(-5px) translateY(10px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        container.appendChild(fog);
    }

    setupDataRefresh() {
        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.refreshData(true);
        }, 30000);
    }

    async refreshData(silent = false) {
        if (this.isRefreshing) return;
        
        this.isRefreshing = true;
        
        if (!silent) {
            this.showRefreshIndicator();
        }

        try {
            // Fetch latest mood
            const moodResponse = await fetch('/api/mood');
            const moodData = await moodResponse.json();
            
            // Update window if mood changed
            if (moodData.mood !== this.currentMood) {
                this.updateWindowMood(moodData.mood, moodData.description);
            }
            
            // Fetch latest stats (could be used for live updates)
            const statsResponse = await fetch('/api/stats');
            const statsData = await statsResponse.json();
            
            if (!silent) {
                this.showSuccessMessage('다락방이 새로워졌어요 ✨');
            }
            
        } catch (error) {
            console.error('Failed to refresh data:', error);
            if (!silent) {
                this.showErrorMessage('새로고침에 실패했어요 😕');
            }
        } finally {
            this.isRefreshing = false;
        }
    }

    updateWindowMood(newMood, description) {
        const windowScene = document.getElementById('windowScene');
        const moodDescription = document.getElementById('moodDescription');
        
        if (windowScene) {
            // Remove old mood class
            windowScene.className = windowScene.className.replace(/\b(sunny|clear|peaceful|cloudy|foggy|rainy|storm)\b/g, '');
            // Add new mood class
            windowScene.classList.add(newMood);
            
            // Add transition effect
            windowScene.style.transition = 'all 1.5s ease-in-out';
            this.currentMood = newMood;
            
            // Update weather effects
            setTimeout(() => {
                this.addWeatherEffects();
            }, 500);
        }
        
        if (moodDescription) {
            // Fade out, change text, fade in
            moodDescription.style.opacity = '0';
            setTimeout(() => {
                moodDescription.textContent = description;
                moodDescription.style.opacity = '1';
            }, 300);
        }
    }

    setupInteractiveElements() {
        // Emotion bubbles hover effect
        document.querySelectorAll('.emotion-bubble').forEach(bubble => {
            bubble.addEventListener('mouseenter', () => {
                bubble.style.transform = 'translateX(5px)';
                bubble.style.borderLeftWidth = '6px';
            });
            
            bubble.addEventListener('mouseleave', () => {
                bubble.style.transform = 'translateX(0)';
                bubble.style.borderLeftWidth = '4px';
            });
        });

        // Stats items pulse on hover
        document.querySelectorAll('.stat-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                const number = item.querySelector('.stat-number');
                if (number) {
                    number.style.animation = 'pulse 0.6s ease-in-out';
                }
            });
        });

        // Window click for mood details
        const windowContent = document.querySelector('.window-content');
        if (windowContent) {
            windowContent.addEventListener('click', () => {
                this.showMoodDetails();
            });
        }
    }

    showMoodDetails() {
        const modal = this.createModal(
            '🪟 창밖 풍경',
            `
            <div style="text-align: center; padding: 1rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${this.getMoodEmoji()}</div>
                <h3 style="margin-bottom: 1rem; color: #6b5842;">현재 감정: ${this.getMoodName()}</h3>
                <p style="line-height: 1.6; color: #7a7a7a;">
                    ${window.moodDescription || '고요한 오후의 풍경입니다'}
                </p>
                <div style="margin-top: 1.5rem;">
                    <button onclick="this.closest('.modal').remove()" 
                            style="background: #8b7355; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer;">
                        창문 닫기
                    </button>
                </div>
            </div>
            `
        );
        document.body.appendChild(modal);
    }

    getMoodEmoji() {
        const emojis = {
            sunny: '☀️',
            clear: '🌤️',
            peaceful: '🌾',
            cloudy: '☁️',
            foggy: '🌫️',
            rainy: '🌧️',
            storm: '⛈️'
        };
        return emojis[this.currentMood] || '🌸';
    }

    getMoodName() {
        const names = {
            sunny: '맑고 화창함',
            clear: '청명함',
            peaceful: '평온함',
            cloudy: '흐림',
            foggy: '안개',
            rainy: '비',
            storm: '폭풍'
        };
        return names[this.currentMood] || '알 수 없음';
    }

    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease-out;
            ">
                <div style="
                    padding: 1.5rem;
                    border-bottom: 1px solid #eee;
                    background: #f7f5f3;
                    border-radius: 15px 15px 0 0;
                ">
                    <h2 style="margin: 0; color: #4a4a4a; font-size: 1.3rem;">${title}</h2>
                </div>
                <div>${content}</div>
            </div>
        `;
        
        // Add CSS animations
        if (!document.querySelector('#modalAnimations')) {
            const style = document.createElement('style');
            style.id = 'modalAnimations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-50px) scale(0.9); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return modal;
    }

    showRefreshIndicator() {
        this.showMessage('🔄 새로고침 중...', 'info');
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            z-index: 1001;
            font-size: 0.9rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease-out;
        `;
        toast.textContent = message;
        
        if (!document.querySelector('#toastAnimation')) {
            const style = document.createElement('style');
            style.id = 'toastAnimation';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Global functions for buttons
function refreshData() {
    if (window.attic) {
        window.attic.refreshData();
    }
}

function openTerminal() {
    window.attic.showMessage('터미널을 열어 "emo"를 입력해보세요! 💻', 'info');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.attic = new EmotionalAttic();
});

// Initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.attic = new EmotionalAttic();
    });
} else {
    window.attic = new EmotionalAttic();
}

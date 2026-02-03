/* ===== SAMSUNG DEX CORE SYSTEM ===== */
class SamsungDeX {
    constructor() {
        this.system = {
            version: '4.0',
            build: 'R16NW.G955FXXU4CRGB',
            model: 'Samsung DeX Web',
            uptime: 0
        };
        
        this.windows = new Map();
        this.apps = new Map();
        this.settings = {
            theme: 'dark',
            wallpaper: 1,
            wifi: true,
            bluetooth: false,
            darkMode: true,
            brightness: 80,
            volume: 75,
            layout: 'desktop'
        };
        
        this.currentZIndex = 100;
        this.activeWindow = null;
        this.runningApps = [];
        
        this.init();
    }
    
    init() {
        console.log('Samsung DeX Initializing...');
        
        // Start boot sequence
        this.startBootSequence();
        
        // Initialize components
        this.initClock();
        this.initEventListeners();
        this.initApps();
        this.loadSettings();
        
        console.log('Samsung DeX Ready');
    }
    
    startBootSequence() {
        const bootScreen = document.getElementById('samsung-boot');
        const desktop = document.getElementById('dex-desktop');
        
        // Animate boot progress
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 100);
        }
        
        // Boot messages
        const messages = [
            'Starting Samsung DeX...',
            'Loading system components...',
            'Initializing user interface...',
            'Optimizing your experience...',
            'Almost ready...'
        ];
        
        let messageIndex = 0;
        const messageElement = document.querySelector('.boot-message');
        
        const messageInterval = setInterval(() => {
            if (messageElement && messageIndex < messages.length) {
                messageElement.textContent = messages[messageIndex];
                messageIndex++;
            }
        }, 500);
        
        // Complete boot after 3 seconds
        setTimeout(() => {
            clearInterval(messageInterval);
            
            // Hide boot screen
            bootScreen.style.opacity = '0';
            bootScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                bootScreen.style.display = 'none';
                
                // Show desktop
                desktop.classList.remove('hidden');
                
                // Start desktop animations
                this.animateDesktopEntrance();
                
                // Show welcome notification
                this.showNotification({
                    title: 'Welcome to Samsung DeX',
                    message: 'Your desktop experience is ready',
                    icon: 'fas fa-check-circle',
                    type: 'success'
                });
                
                // Update system uptime counter
                setInterval(() => {
                    this.system.uptime++;
                }, 1000);
                
            }, 500);
        }, 3000);
    }
    
    animateDesktopEntrance() {
        const desktop = document.getElementById('dex-desktop');
        const icons = document.querySelectorAll('.dex-icon');
        const taskbar = document.getElementById('dex-taskbar');
        
        // Animate desktop appearance
        desktop.style.opacity = '0';
        desktop.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            desktop.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            desktop.style.opacity = '1';
            desktop.style.transform = 'scale(1)';
            
            // Animate taskbar
            if (taskbar) {
                taskbar.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    taskbar.style.transition = 'transform 0.3s ease';
                    taskbar.style.transform = 'translateY(0)';
                }, 100);
            }
            
            // Stagger icon animations
            icons.forEach((icon, index) => {
                icon.style.opacity = '0';
                icon.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    icon.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    icon.style.opacity = '1';
                    icon.style.transform = 'translateY(0)';
                }, 200 + (index * 50));
            });
        }, 100);
    }
    
    initClock() {
        const updateTime = () => {
            const now = new Date();
            const timeElement = document.getElementById('dex-time');
            const dateElement = document.getElementById('dex-date');
            
            if (timeElement) {
                timeElement.textContent = now.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }
            
            if (dateElement) {
                dateElement.textContent = now.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });
            }
        };
        
        updateTime();
        setInterval(updateTime, 60000); // Update every minute
    }
    
    initEventListeners() {
        // Start Menu
        const startBtn = document.getElementById('dex-start');
        const startMenu = document.getElementById('dex-start-menu');
        const startMenuClose = startMenu.querySelector('.start-menu-close');
        
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });
        
        startMenuClose.addEventListener('click', () => {
            this.closeStartMenu();
        });
        
        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                this.closeStartMenu();
            }
        });
        
        // Quick Settings
        const settingsBtn = document.getElementById('dex-settings');
        const quickSettings = document.getElementById('dex-quick-settings');
        const settingsClose = quickSettings.querySelector('.settings-close');
        
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleQuickSettings();
        });
        
        settingsClose.addEventListener('click', () => {
            this.closeQuickSettings();
        });
        
        // Notifications
        const notificationsBtn = document.getElementById('dex-notifications');
        const notificationsPanel = document.getElementById('dex-notifications-panel');
        const notificationsClose = notificationsPanel.querySelector('.notifications-close');
        
        notificationsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNotifications();
        });
        
        notificationsClose.addEventListener('click', () => {
            this.closeNotifications();
        });
        
        // Clear all notifications
        const clearAllBtn = notificationsPanel.querySelector('.clear-all');
        clearAllBtn.addEventListener('click', () => {
            this.clearAllNotifications();
        });
        
        // Desktop icons
        document.querySelectorAll('.dex-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                const app = icon.getAttribute('data-app');
                this.launchApp(app);
            });
            
            // Add right-click context menu
            icon.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showContextMenu(e, icon);
            });
        });
        
        // Start menu apps
        document.querySelectorAll('.start-app').forEach(app => {
            app.addEventListener('click', () => {
                const appName = app.getAttribute('data-app');
                this.launchApp(appName);
                this.closeStartMenu();
            });
        });
        
        // Pinned apps
        document.querySelectorAll('.pinned-app').forEach(app => {
            app.addEventListener('click', () => {
                const appName = app.getAttribute('data-app');
                this.launchApp(appName);
            });
        });
        
        // Quick settings toggles
        document.querySelectorAll('.quick-setting').forEach(setting => {
            setting.addEventListener('click', () => {
                const settingName = setting.getAttribute('data-setting');
                this.toggleQuickSetting(settingName);
            });
        });
        
        // Layout options
        document.querySelectorAll('.layout-option').forEach(option => {
            option.addEventListener('click', () => {
                const layout = option.getAttribute('data-layout');
                this.setLayout(layout);
                
                // Update active state
                document.querySelectorAll('.layout-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
            });
        });
        
        // Volume and brightness sliders
        const volumeSlider = document.querySelector('.volume-slider input');
        const brightnessSlider = document.querySelector('.brightness-slider input');
        
        if (volumeSlider) {
            volumeSlider.value = this.settings.volume;
            volumeSlider.addEventListener('input', (e) => {
                this.settings.volume = e.target.value;
                this.showNotification({
                    title: 'Volume',
                    message: `Set to ${this.settings.volume}%`,
                    icon: 'fas fa-volume-up'
                });
            });
        }
        
        if (brightnessSlider) {
            brightnessSlider.value = this.settings.brightness;
            brightnessSlider.addEventListener('input', (e) => {
                this.settings.brightness = e.target.value;
                document.getElementById('dex-desktop').style.filter = `brightness(${this.settings.brightness}%)`;
                
                this.showNotification({
                    title: 'Brightness',
                    message: `Set to ${this.settings.brightness}%`,
                    icon: 'fas fa-sun'
                });
            });
        }
        
        // WiFi toggle
        const wifiToggle = document.getElementById('wifi-toggle');
        if (wifiToggle) {
            wifiToggle.checked = this.settings.wifi;
            wifiToggle.addEventListener('change', (e) => {
                this.settings.wifi = e.target.checked;
                this.showNotification({
                    title: 'Wi-Fi',
                    message: e.target.checked ? 'Connected to Home_WiFi_5G' : 'Wi-Fi turned off',
                    icon: 'fas fa-wifi',
                    type: e.target.checked ? 'success' : 'info'
                });
            });
        }
        
        // Bluetooth toggle
        const bluetoothToggle = document.getElementById('bluetooth-toggle');
        if (bluetoothToggle) {
            bluetoothToggle.checked = this.settings.bluetooth;
            bluetoothToggle.addEventListener('change', (e) => {
                this.settings.bluetooth = e.target.checked;
                this.showNotification({
                    title: 'Bluetooth',
                    message: e.target.checked ? 'Bluetooth turned on' : 'Bluetooth turned off',
                    icon: 'fas fa-bluetooth'
                });
            });
        }
        
        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkmode-toggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.settings.darkMode;
            darkModeToggle.addEventListener('change', (e) => {
                this.settings.darkMode = e.target.checked;
                this.setTheme(this.settings.darkMode ? 'dark' : 'light');
            });
        }
        
        // Power options
        const powerBtn = document.querySelector('.power-options');
        powerBtn.addEventListener('click', () => {
            this.showPowerMenu();
        });
        
        // Full settings button
        const fullSettingsBtn = document.querySelector('.full-settings-btn');
        fullSettingsBtn.addEventListener('click', () => {
            this.launchApp('settings');
            this.closeQuickSettings();
        });
        
        // Keyboard shortcuts
        this.initKeyboardShortcuts();
        
        // Window drag & resize
        this.initWindowManagement();
    }
    
    initApps() {
        // Register all apps
        this.apps.set('myfiles', {
            name: 'My Files',
            icon: 'fas fa-folder',
            component: FileManager,
            canMultiInstance: false
        });
        
        this.apps.set('gallery', {
            name: 'Gallery',
            icon: 'fas fa-images',
            component: GalleryApp,
            canMultiInstance: false
        });
        
        this.apps.set('internet', {
            name: 'Internet',
            icon: 'fas fa-globe',
            component: BrowserApp,
            canMultiInstance: true
        });
        
        this.apps.set('email', {
            name: 'Email',
            icon: 'fas fa-envelope',
            component: EmailApp,
            canMultiInstance: false
        });
        
        this.apps.set('camera', {
            name: 'Camera',
            icon: 'fas fa-camera',
            component: CameraApp,
            canMultiInstance: false
        });
        
        this.apps.set('settings', {
            name: 'Settings',
            icon: 'fas fa-cog',
            component: SettingsApp,
            canMultiInstance: false
        });
        
        this.apps.set('calculator', {
            name: 'Calculator',
            icon: 'fas fa-calculator',
            component: CalculatorApp,
            canMultiInstance: true
        });
        
        this.apps.set('calendar', {
            name: 'Calendar',
            icon: 'fas fa-calendar',
            component: CalendarApp,
            canMultiInstance: false
        });
        
        this.apps.set('contacts', {
            name: 'Contacts',
            icon: 'fas fa-address-book',
            component: ContactsApp,
            canMultiInstance: false
        });
        
        this.apps.set('messages', {
            name: 'Messages',
            icon: 'fas fa-comment-alt',
            component: MessagesApp,
            canMultiInstance: false
        });
        
        this.apps.set('phone', {
            name: 'Phone',
            icon: 'fas fa-phone',
            component: PhoneApp,
            canMultiInstance: false
        });
        
        this.apps.set('clock', {
            name: 'Clock',
            icon: 'fas fa-clock',
            component: ClockApp,
            canMultiInstance: true
        });
        
        this.apps.set('store', {
            name: 'Galaxy Store',
            icon: 'fas fa-shopping-bag',
            component: StoreApp,
            canMultiInstance: false
        });
        
        this.apps.set('bixby', {
            name: 'Bixby',
            icon: 'fas fa-microphone',
            component: BixbyApp,
            canMultiInstance: false
        });
        
        this.apps.set('game-launcher', {
            name: 'Game Launcher',
            icon: 'fas fa-gamepad',
            component: GameLauncherApp,
            canMultiInstance: false
        });
        
        this.apps.set('notes', {
            name: 'Samsung Notes',
            icon: 'fas fa-sticky-note',
            component: NotesApp,
            canMultiInstance: true
        });
    }
    
    launchApp(appId) {
        const appConfig = this.apps.get(appId);
        if (!appConfig) {
            this.showNotification({
                title: 'App Error',
                message: `Application "${appId}" not found`,
                icon: 'fas fa-exclamation-triangle',
                type: 'error'
            });
            return;
        }
        
        // Check if app is already running and doesn't support multiple instances
        if (!appConfig.canMultiInstance) {
            const existingWindow = Array.from(this.windows.values())
                .find(win => win.appId === appId && !win.minimized);
            
            if (existingWindow) {
                this.focusWindow(existingWindow.id);
                return;
            }
        }
        
        // Create window
        const windowId = `window-${appId}-${Date.now()}`;
        const window = this.createWindow(windowId, appConfig);
        
        // Store window reference
        this.windows.set(windowId, {
            id: windowId,
            appId: appId,
            element: window,
            minimized: false,
            maximized: false,
            zIndex: ++this.currentZIndex
        });
        
        // Update z-index
        window.style.zIndex = this.currentZIndex;
        this.activeWindow = windowId;
        
        // Add to running apps
        if (!this.runningApps.includes(appId)) {
            this.runningApps.push(appId);
        }
        
        // Update taskbar
        this.updateTaskbar();
        
        // Show notification
        this.showNotification({
            title: 'App Launched',
            message: `${appConfig.name} is now running`,
            icon: appConfig.icon,
            type: 'success'
        });
        
        // Initialize app
        if (appConfig.component) {
            try {
                const appInstance = new appConfig.component(window, appId);
                window.appInstance = appInstance;
            } catch (error) {
                console.error('Error initializing app:', error);
            }
        }
        
        return windowId;
    }
    
    createWindow(id, appConfig) {
        const template = document.getElementById('window-template');
        const windowClone = template.content.cloneNode(true);
        const windowElement = windowClone.querySelector('.dex-window');
        
        // Set window properties
        windowElement.id = id;
        
        // Set title and icon
        const titleElement = windowElement.querySelector('.window-name');
        const iconElement = windowElement.querySelector('.window-icon');
        
        if (titleElement) titleElement.textContent = appConfig.name;
        if (iconElement) {
            iconElement.className = appConfig.icon;
        }
        
        // Position window (staggered)
        const windows = Array.from(this.windows.values());
        const offsetX = 30 * (windows.length % 5);
        const offsetY = 30 * Math.floor(windows.length / 5);
        
        windowElement.style.left = `${100 + offsetX}px`;
        windowElement.style.top = `${100 + offsetY}px`;
        
        // Add to window area
        document.getElementById('dex-windows').appendChild(windowElement);
        
        // Add window controls
        this.setupWindowControls(windowElement, id);
        
        // Make draggable
        this.makeWindowDraggable(windowElement, id);
        
        // Make resizable
        this.makeWindowResizable(windowElement);
        
        return windowElement;
    }
    
    setupWindowControls(windowElement, windowId) {
        const minimizeBtn = windowElement.querySelector('.minimize');
        const maximizeBtn = windowElement.querySelector('.maximize');
        const closeBtn = windowElement.querySelector('.close');
        const header = windowElement.querySelector('.dex-window-header');
        
        // Minimize
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(windowId);
        });
        
        // Maximize/Restore
        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMaximizeWindow(windowId);
        });
        
        // Close
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(windowId);
        });
        
        // Focus on click
        header.addEventListener('mousedown', () => {
            this.focusWindow(windowId);
        });
        
        // Double-click header to maximize
        header.addEventListener('dblclick', () => {
            this.toggleMaximizeWindow(windowId);
        });
    }
    
    makeWindowDraggable(windowElement, windowId) {
        const header = windowElement.querySelector('.dex-window-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-btn')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = windowElement.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            // Bring to front
            this.focusWindow(windowId);
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            
            e.preventDefault();
        });
        
        const drag = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            // Keep within bounds
            const maxX = window.innerWidth - windowElement.offsetWidth;
            const maxY = window.innerHeight - windowElement.offsetHeight - 56; // Taskbar height
            
            newLeft = Math.max(0, Math.min(newLeft, maxX));
            newTop = Math.max(0, Math.min(newTop, maxY));
            
            windowElement.style.left = `${newLeft}px`;
            windowElement.style.top = `${newTop}px`;
        };
        
        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        };
    }
    
    makeWindowResizable(windowElement) {
        const resizeHandle = 10;
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        
        const startResize = (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(getComputedStyle(windowElement).width, 10);
            startHeight = parseInt(getComputedStyle(windowElement).height, 10);
            
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            
            e.preventDefault();
        };
        
        const resize = (e) => {
            if (!isResizing) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newWidth = startWidth + deltaX;
            let newHeight = startHeight + deltaY;
            
            // Minimum size constraints
            newWidth = Math.max(400, newWidth);
            newHeight = Math.max(300, newHeight);
            
            // Maximum size constraints
            newWidth = Math.min(newWidth, window.innerWidth * 0.9);
            newHeight = Math.min(newHeight, window.innerHeight * 0.8);
            
            windowElement.style.width = `${newWidth}px`;
            windowElement.style.height = `${newHeight}px`;
        };
        
        const stopResize = () => {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        };
        
        // Add resize handles to all corners and edges
        const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
        directions.forEach(dir => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${dir}`;
            handle.style.cssText = `
                position: absolute;
                background: transparent;
                z-index: 100;
            `;
            
            // Position based on direction
            switch(dir) {
                case 'n': handle.style.top = '0'; handle.style.left = '0'; handle.style.right = '0'; handle.style.height = `${resizeHandle}px`; handle.style.cursor = 'ns-resize'; break;
                case 'ne': handle.style.top = '0'; handle.style.right = '0'; handle.style.width = `${resizeHandle}px`; handle.style.height = `${resizeHandle}px`; handle.style.cursor = 'ne-resize'; break;
                case 'e': handle.style.top = '0'; handle.style.right = '0'; handle.style.bottom = '0'; handle.style.width = `${resizeHandle}px`; handle.style.cursor = 'ew-resize'; break;
                case 'se': handle.style.bottom = '0'; handle.style.right = '0'; handle.style.width = `${resizeHandle}px`; handle.style.height = `${resizeHandle}px`; handle.style.cursor = 'se-resize'; break;
                case 's': handle.style.bottom = '0'; handle.style.left = '0'; handle.style.right = '0'; handle.style.height = `${resizeHandle}px`; handle.style.cursor = 'ns-resize'; break;
                case 'sw': handle.style.bottom = '0'; handle.style.left = '0'; handle.style.width = `${resizeHandle}px`; handle.style.height = `${resizeHandle}px`; handle.style.cursor = 'sw-resize'; break;
                case 'w': handle.style.top = '0'; handle.style.left = '0'; handle.style.bottom = '0'; handle.style.width = `${resizeHandle}px`; handle.style.cursor = 'ew-resize'; break;
                case 'nw': handle.style.top = '0'; handle.style.left = '0'; handle.style.width = `${resizeHandle}px`; handle.style.height = `${resizeHandle}px`; handle.style.cursor = 'nw-resize'; break;
            }
            
            handle.addEventListener('mousedown', startResize);
            windowElement.appendChild(handle);
        });
    }
    
    focusWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;
        
        // Update z-index
        windowData.zIndex = ++this.currentZIndex;
        windowData.element.style.zIndex = windowData.zIndex;
        this.activeWindow = windowId;
        
        // Update taskbar
        this.updateTaskbar();
    }
    
    minimizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;
        
        windowData.minimized = true;
        windowData.element.style.display = 'none';
        
        // Update taskbar
        this.updateTaskbar();
    }
    
    toggleMaximizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;
        
        const windowElement = windowData.element;
        const maximizeBtn = windowElement.querySelector('.maximize');
        
        if (windowData.maximized) {
            // Restore
            windowElement.classList.remove('maximized');
            windowElement.style.width = '800px';
            windowElement.style.height = '600px';
            windowElement.style.top = '100px';
            windowElement.style.left = '100px';
            maximizeBtn.innerHTML = '<i class="fas fa-square"></i>';
            maximizeBtn.title = 'Maximize';
            windowData.maximized = false;
        } else {
            // Maximize
            windowElement.classList.add('maximized');
            windowElement.style.width = 'calc(100% - 32px)';
            windowElement.style.height = 'calc(100% - 88px)';
            windowElement.style.top = '16px';
            windowElement.style.left = '16px';
            maximizeBtn.innerHTML = '<i class="fas fa-window-restore"></i>';
            maximizeBtn.title = 'Restore';
            windowData.maximized = true;
        }
        
        // Bring to front
        this.focusWindow(windowId);
    }
    
    closeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;
        
        // Remove window element
        if (windowData.element.parentNode) {
            windowData.element.parentNode.removeChild(windowData.element);
        }
        
        // Remove from windows map
        this.windows.delete(windowId);
        
        // Update running apps
        const appId = windowData.appId;
        const otherWindowsOfApp = Array.from(this.windows.values())
            .filter(win => win.appId === appId);
        
        if (otherWindowsOfApp.length === 0) {
            this.runningApps = this.runningApps.filter(app => app !== appId);
        }
        
        // Update taskbar
        this.updateTaskbar();
        
        // Show notification
        const appConfig = this.apps.get(appId);
        if (appConfig) {
            this.showNotification({
                title: 'App Closed',
                message: `${appConfig.name} has been closed`,
                icon: appConfig.icon
            });
        }
        
        // Clean up app instance
        if (windowData.element.appInstance && 
            typeof windowData.element.appInstance.cleanup === 'function') {
            windowData.element.appInstance.cleanup();
        }
    }
    
    updateTaskbar() {
        const taskbarCenter = document.getElementById('taskbar-apps');
        if (!taskbarCenter) return;
        
        // Clear current taskbar apps
        taskbarCenter.innerHTML = '';
        
        // Add running apps
        this.windows.forEach((windowData, windowId) => {
            const appConfig = this.apps.get(windowData.appId);
            if (!appConfig) return;
            
            const taskbarApp = document.createElement('button');
            taskbarApp.className = 'taskbar-app';
            if (windowId === this.activeWindow && !windowData.minimized) {
                taskbarApp.classList.add('active');
            }
            
            taskbarApp.innerHTML = `
                <i class="${appConfig.icon}"></i>
                <span>${appConfig.name}</span>
            `;
            
            taskbarApp.addEventListener('click', () => {
                if (windowData.minimized) {
                    // Restore window
                    windowData.minimized = false;
                    windowData.element.style.display = 'block';
                    this.focusWindow(windowId);
                } else if (windowId === this.activeWindow) {
                    // Minimize window if it's already active
                    this.minimizeWindow(windowId);
                } else {
                    // Focus window
                    this.focusWindow(windowId);
                }
            });
            
            taskbarApp.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showTaskbarContextMenu(e, windowId);
            });
            
            taskbarCenter.appendChild(taskbarApp);
        });
    }
    
    showTaskbarContextMenu(event, windowId) {
        // Remove existing context menus
        document.querySelectorAll('.context-menu').forEach(menu => menu.remove());
        
        const windowData = this.windows.get(windowId);
        if (!windowData) return;
        
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            background: rgba(40, 45, 60, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 8px;
            z-index: 9999;
            min-width: 160px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        `;
        
        menu.innerHTML = `
            <button class="context-menu-item" data-action="restore">
                <i class="fas fa-window-restore"></i>
                <span>Restore</span>
            </button>
            <button class="context-menu-item" data-action="minimize">
                <i class="fas fa-window-minimize"></i>
                <span>Minimize</span>
            </button>
            <button class="context-menu-item" data-action="maximize">
                <i class="fas fa-window-maximize"></i>
                <span>Maximize</span>
            </button>
            <hr style="border: none; height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;">
            <button class="context-menu-item" data-action="close">
                <i class="fas fa-times"></i>
                <span>Close</span>
            </button>
        `;
        
        // Position menu
        menu.style.left = `${event.clientX}px`;
        menu.style.top = `${event.clientY}px`;
        
        document.body.appendChild(menu);
        
        // Add event listeners
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                switch(action) {
                    case 'restore':
                        windowData.minimized = false;
                        windowData.element.style.display = 'block';
                        this.focusWindow(windowId);
                        break;
                    case 'minimize':
                        this.minimizeWindow(windowId);
                        break;
                    case 'maximize':
                        this.toggleMaximizeWindow(windowId);
                        break;
                    case 'close':
                        this.closeWindow(windowId);
                        break;
                }
                menu.remove();
            });
        });
        
        // Close menu when clicking outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    }
    
    showContextMenu(event, element) {
        event.preventDefault();
        
        // Remove existing context menus
        document.querySelectorAll('.context-menu').forEach(menu => menu.remove());
        
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            background: rgba(40, 45, 60, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 8px;
            z-index: 9999;
            min-width: 160px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        `;
        
        menu.innerHTML = `
            <button class="context-menu-item" data-action="open">
                <i class="fas fa-play"></i>
                <span>Open</span>
            </button>
            <button class="context-menu-item" data-action="properties">
                <i class="fas fa-info-circle"></i>
                <span>Properties</span>
            </button>
            <hr style="border: none; height: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;">
            <button class="context-menu-item" data-action="rename">
                <i class="fas fa-i-cursor"></i>
                <span>Rename</span>
            </button>
            <button class="context-menu-item" data-action="delete">
                <i class="fas fa-trash"></i>
                <span>Delete</span>
            </button>
        `;
        
        // Position menu
        menu.style.left = `${event.clientX}px`;
        menu.style.top = `${event.clientY}px`;
        
        document.body.appendChild(menu);
        
        // Add event listeners
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                const app = element.getAttribute('data-app');
                
                switch(action) {
                    case 'open':
                        this.launchApp(app);
                        break;
                    case 'properties':
                        this.showProperties(app, element);
                        break;
                    case 'rename':
                        this.renameDesktopIcon(element);
                        break;
                    case 'delete':
                        this.showNotification({
                            title: 'Delete',
                            message: 'This feature is not available in the simulation',
                            icon: 'fas fa-trash',
                            type: 'info'
                        });
                        break;
                }
                menu.remove();
            });
        });
        
        // Close menu when clicking outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    }
    
    showProperties(appId, element) {
        const appConfig = this.apps.get(appId);
        if (!appConfig) return;
        
        this.showNotification({
            title: 'Properties',
            message: `${appConfig.name}\nType: Application\nLocation: Desktop`,
            icon: 'fas fa-info-circle',
            type: 'info',
            duration: 5000
        });
    }
    
    renameDesktopIcon(element) {
        const label = element.querySelector('.dex-icon-label');
        const originalText = label.textContent;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        input.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            text-align: center;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #4285f4;
            border-radius: 4px;
            color: white;
            font-size: 12px;
            padding: 2px;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.appendChild(input);
        input.focus();
        input.select();
        
        const finishRename = () => {
            if (input.value.trim()) {
                label.textContent = input.value.trim();
            }
            input.remove();
            element.style.position = '';
        };
        
        input.addEventListener('blur', finishRename);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                finishRename();
            } else if (e.key === 'Escape') {
                input.value = originalText;
                finishRename();
            }
        });
    }
    
    toggleStartMenu() {
        const startMenu = document.getElementById('dex-start-menu');
        if (startMenu.classList.contains('hidden')) {
            this.openStartMenu();
        } else {
            this.closeStartMenu();
        }
    }
    
    openStartMenu() {
        const startMenu = document.getElementById('dex-start-menu');
        startMenu.classList.remove('hidden');
        startMenu.style.zIndex = ++this.currentZIndex;
    }
    
    closeStartMenu() {
        const startMenu = document.getElementById('dex-start-menu');
        startMenu.classList.add('hidden');
    }
    
    toggleQuickSettings() {
        const quickSettings = document.getElementById('dex-quick-settings');
        const notifications = document.getElementById('dex-notifications-panel');
        
        // Close notifications if open
        if (!notifications.classList.contains('hidden')) {
            notifications.classList.add('hidden');
        }
        
        if (quickSettings.classList.contains('hidden')) {
            quickSettings.classList.remove('hidden');
            quickSettings.style.zIndex = ++this.currentZIndex;
        } else {
            quickSettings.classList.add('hidden');
        }
    }
    
    closeQuickSettings() {
        const quickSettings = document.getElementById('dex-quick-settings');
        quickSettings.classList.add('hidden');
    }
    
    toggleNotifications() {
        const notifications = document.getElementById('dex-notifications-panel');
        const quickSettings = document.getElementById('dex-quick-settings');
        
        // Close quick settings if open
        if (!quickSettings.classList.contains('hidden')) {
            quickSettings.classList.add('hidden');
        }
        
        if (notifications.classList.contains('hidden')) {
            notifications.classList.remove('hidden');
            notifications.style.zIndex = ++this.currentZIndex;
        } else {
            notifications.classList.add('hidden');
        }
    }
    
    closeNotifications() {
        const notifications = document.getElementById('dex-notifications-panel');
        notifications.classList.add('hidden');
    }
    
    clearAllNotifications() {
        const notificationsList = document.querySelector('.notifications-list');
        const notificationItems = notificationsList.querySelectorAll('.notification-item.new');
        
        notificationItems.forEach(item => {
            item.classList.remove('new');
        });
        
        // Update notification badge
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = '0';
        }
        
        this.showNotification({
            title: 'Notifications Cleared',
            message: 'All notifications have been cleared',
            icon: 'fas fa-check-circle',
            type: 'success'
        });
    }
    
    toggleQuickSetting(setting) {
        switch(setting) {
            case 'wifi':
                this.settings.wifi = !this.settings.wifi;
                document.getElementById('wifi-toggle').checked = this.settings.wifi;
                this.showNotification({
                    title: 'Wi-Fi',
                    message: this.settings.wifi ? 'Connected to Home_WiFi_5G' : 'Wi-Fi turned off',
                    icon: 'fas fa-wifi',
                    type: this.settings.wifi ? 'success' : 'info'
                });
                break;
                
            case 'bluetooth':
                this.settings.bluetooth = !this.settings.bluetooth;
                document.getElementById('bluetooth-toggle').checked = this.settings.bluetooth;
                this.showNotification({
                    title: 'Bluetooth',
                    message: this.settings.bluetooth ? 'Bluetooth turned on' : 'Bluetooth turned off',
                    icon: 'fas fa-bluetooth'
                });
                break;
                
            case 'darkmode':
                this.settings.darkMode = !this.settings.darkMode;
                document.getElementById('darkmode-toggle').checked = this.settings.darkMode;
                this.setTheme(this.settings.darkMode ? 'dark' : 'light');
                break;
                
            case 'screencast':
                this.showNotification({
                    title: 'Screen Cast',
                    message: 'Searching for available devices...',
                    icon: 'fas fa-tv',
                    type: 'info'
                });
                break;
        }
    }
    
    setLayout(layout) {
        this.settings.layout = layout;
        
        let message = '';
        switch(layout) {
            case 'desktop':
                message = 'Desktop layout activated';
                break;
            case 'phone':
                message = 'Phone screen layout activated';
                break;
            case 'multi':
                message = 'Multi-window layout activated';
                break;
        }
        
        this.showNotification({
            title: 'Screen Layout',
            message: message,
            icon: 'fas fa-desktop',
            type: 'success'
        });
    }
    
    setTheme(theme) {
        this.settings.theme = theme;
        const body = document.body;
        
        if (theme === 'light') {
            body.style.backgroundColor = '#f5f5f5';
            body.style.color = '#333';
        } else {
            body.style.backgroundColor = '#000';
            body.style.color = '#fff';
        }
        
        this.showNotification({
            title: 'Theme Changed',
            message: `${theme === 'dark' ? 'Dark' : 'Light'} mode activated`,
            icon: theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun',
            type: 'success'
        });
    }
    
    showPowerMenu() {
        // Remove existing power menu
        document.querySelectorAll('.power-menu').forEach(menu => menu.remove());
        
        const menu = document.createElement('div');
        menu.className = 'context-menu power-menu';
        menu.style.cssText = `
            position: fixed;
            bottom: 70px;
            left: 16px;
            background: rgba(40, 45, 60, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 8px;
            z-index: 9999;
            min-width: 200px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        `;
        
        menu.innerHTML = `
            <button class="context-menu-item" data-action="lock">
                <i class="fas fa-lock"></i>
                <span>Lock</span>
            </button>
            <button class="context-menu-item" data-action="restart">
                <i class="fas fa-redo"></i>
                <span>Restart</span>
            </button>
            <button class="context-menu-item" data-action="shutdown">
                <i class="fas fa-power-off"></i>
                <span>Shut Down</span>
            </button>
        `;
        
        document.body.appendChild(menu);
        
        // Add event listeners
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.getAttribute('data-action');
                
                switch(action) {
                    case 'lock':
                        this.lockScreen();
                        break;
                    case 'restart':
                        this.restartSystem();
                        break;
                    case 'shutdown':
                        this.shutdownSystem();
                        break;
                }
                menu.remove();
            });
        });
        
        // Close menu when clicking outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && !document.querySelector('.power-options').contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    }
    
    lockScreen() {
        const lockScreen = document.createElement('div');
        lockScreen.id = 'lock-screen';
        lockScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a2e 0%, #1a1a4a 100%);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: white;
        `;
        
        const now = new Date();
        lockScreen.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 72px; font-weight: 300; margin-bottom: 10px;">
                    ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                </div>
                <div style="font-size: 20px; color: rgba(255,255,255,0.7); margin-bottom: 40px;">
                    ${now.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'})}
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; backdrop-filter: blur(10px);">
                    <div style="margin-bottom: 15px; font-size: 14px; color: rgba(255,255,255,0.8);">
                        Enter password to unlock
                    </div>
                    <input type="password" id="lock-password" 
                           style="width: 200px; padding: 12px; background: rgba(255,255,255,0.1); 
                                  border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; 
                                  color: white; margin-bottom: 15px; text-align: center;"
                           placeholder="Password">
                    <br>
                    <button id="unlock-btn" 
                            style="padding: 10px 30px; background: #4285f4; border: none; 
                                   border-radius: 8px; color: white; cursor: pointer;">
                        Unlock
                    </button>
                </div>
                <div style="margin-top: 30px; font-size: 14px; color: rgba(255,255,255,0.5);">
                    Press any key or click to unlock
                </div>
            </div>
        `;
        
        document.body.appendChild(lockScreen);
        
        // Auto-focus password field
        setTimeout(() => {
            document.getElementById('lock-password').focus();
        }, 100);
        
        // Unlock button
        document.getElementById('unlock-btn').addEventListener('click', () => {
            this.unlockScreen();
        });
        
        // Enter key to unlock
        lockScreen.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.unlockScreen();
            }
        });
        
        // Click to unlock
        lockScreen.addEventListener('click', (e) => {
            if (e.target === lockScreen) {
                this.unlockScreen();
            }
        });
    }
    
    unlockScreen() {
        const lockScreen = document.getElementById('lock-screen');
        if (lockScreen) {
            lockScreen.remove();
            this.showNotification({
                title: 'Unlocked',
                message: 'Welcome back to Samsung DeX',
                icon: 'fas fa-unlock',
                type: 'success'
            });
        }
    }
    
    restartSystem() {
        this.showNotification({
            title: 'Restarting',
            message: 'Samsung DeX is restarting...',
            icon: 'fas fa-redo',
            type: 'warning',
            duration: 2000
        });
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
    
    shutdownSystem() {
        this.showNotification({
            title: 'Shutting Down',
            message: 'Samsung DeX is shutting down...',
            icon: 'fas fa-power-off',
            type: 'warning',
            duration: 2000
        });
        
        setTimeout(() => {
            // Go back to boot screen
            document.getElementById('dex-desktop').classList.add('hidden');
            document.getElementById('samsung-boot').style.display = 'flex';
            document.getElementById('samsung-boot').style.opacity = '1';
            
            // Reset progress bar
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
            
            // Show shutdown message
            const messageElement = document.querySelector('.boot-message');
            if (messageElement) {
                messageElement.textContent = 'System powered off';
            }
        }, 2000);
    }
    
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + Tab - Switch windows
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                this.switchWindows();
            }
            
            // Win + D - Show desktop
            if ((e.metaKey || e.key === 'Meta') && e.key === 'd') {
                e.preventDefault();
                this.showDesktop();
            }
            
            // Win + L - Lock screen
            if ((e.metaKey || e.key === 'Meta') && e.key === 'l') {
                e.preventDefault();
                this.lockScreen();
            }
            
            // Win + E - Open My Files
            if ((e.metaKey || e.key === 'Meta') && e.key === 'e') {
                e.preventDefault();
                this.launchApp('myfiles');
            }
            
            // Alt + F4 - Close active window
            if (e.altKey && e.key === 'F4') {
                e.preventDefault();
                if (this.activeWindow) {
                    this.closeWindow(this.activeWindow);
                }
            }
        });
    }
    
    switchWindows() {
        const windows = Array.from(this.windows.values())
            .filter(win => !win.minimized);
        
        if (windows.length > 0) {
            // Find current active window index
            let currentIndex = windows.findIndex(win => win.id === this.activeWindow);
            
            // Calculate next window index
            const nextIndex = (currentIndex + 1) % windows.length;
            const nextWindow = windows[nextIndex];
            
            // Focus next window
            if (nextWindow) {
                this.focusWindow(nextWindow.id);
            }
        }
    }
    
    showDesktop() {
        // Minimize all windows
        this.windows.forEach((windowData, windowId) => {
            if (!windowData.minimized) {
                this.minimizeWindow(windowId);
            }
        });
    }
    
    loadSettings() {
        // Load from localStorage
        const savedSettings = localStorage.getItem('dex-settings');
        if (savedSettings) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
                
                // Apply settings
                if (this.settings.darkMode !== undefined) {
                    document.getElementById('darkmode-toggle').checked = this.settings.darkMode;
                    this.setTheme(this.settings.darkMode ? 'dark' : 'light');
                }
                
                if (this.settings.brightness !== undefined) {
                    const brightnessSlider = document.querySelector('.brightness-slider input');
                    if (brightnessSlider) {
                        brightnessSlider.value = this.settings.brightness;
                        document.getElementById('dex-desktop').style.filter = 
                            `brightness(${this.settings.brightness}%)`;
                    }
                }
                
                if (this.settings.volume !== undefined) {
                    const volumeSlider = document.querySelector('.volume-slider input');
                    if (volumeSlider) {
                        volumeSlider.value = this.settings.volume;
                    }
                }
                
                if (this.settings.wifi !== undefined) {
                    document.getElementById('wifi-toggle').checked = this.settings.wifi;
                }
                
                if (this.settings.bluetooth !== undefined) {
                    document.getElementById('bluetooth-toggle').checked = this.settings.bluetooth;
                }
                
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }
    
    saveSettings() {
        localStorage.setItem('dex-settings', JSON.stringify(this.settings));
    }
    
    showNotification(data) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `dex-notification notification-${data.type || 'info'}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(40, 45, 60, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            width: 320px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: flex-start;
            gap: 12px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 20px; color: ${this.getNotificationColor(data.type)};">
                <i class="${data.icon || 'fas fa-info-circle'}"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 14px; color: white; margin-bottom: 4px;">
                    ${data.title}
                </div>
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7); line-height: 1.4;">
                    ${data.message}
                </div>
            </div>
            <button class="notification-close" style="background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; font-size: 16px;">
                ×
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            closeNotification();
        });
        
        // Auto close
        const duration = data.duration || 5000;
        const autoClose = setTimeout(closeNotification, duration);
        
        function closeNotification() {
            clearTimeout(autoClose);
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
        
        // Update notification badge
        if (data.type !== 'info') {
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                const count = parseInt(badge.textContent) || 0;
                badge.textContent = count + 1;
            }
        }
    }
    
    getNotificationColor(type) {
        switch(type) {
            case 'success': return '#34a853';
            case 'warning': return '#fbbc05';
            case 'error': return '#ea4335';
            default: return '#4285f4';
        }
    }
    
    getSystemInfo() {
        return {
            ...this.system,
            uptime: this.formatUptime(this.system.uptime),
            runningApps: this.runningApps.length,
            openWindows: this.windows.size,
            settings: this.settings
        };
    }
    
    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize Samsung DeX when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dex = new SamsungDeX();
}); 
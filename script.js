/* ===== SAMSUNG DEX WEB SIMULATOR - MAIN SCRIPT ===== */

// ===== GLOBAL VARIABLES & INITIALIZATION =====
let zIndexCounter = 100; // For window stacking
let activeWindows = new Map(); // Track open windows
let runningApps = []; // Track running apps
let isDragging = false; // Window drag state
let dragWindow = null; // Currently dragged window
let dragOffset = { x: 0, y: 0 }; // Drag offset

// DOM Elements
const bootScreen = document.getElementById('boot-screen');
const desktop = document.getElementById('desktop');
const appDrawerBtn = document.getElementById('app-drawer-btn');
const appDrawer = document.getElementById('app-drawer');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const quickSettingsBtn = document.getElementById('quick-settings-btn');
const quickSettings = document.getElementById('quick-settings');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const windowArea = document.getElementById('window-area');
const taskbarCenter = document.getElementById('taskbar-center');
const clockElement = document.getElementById('clock');
const dateElement = document.querySelector('.date');
const wallpaperElement = document.querySelector('.wallpaper');
const homeBtn = document.getElementById('home-btn');

// ===== BOOT SEQUENCE =====
window.addEventListener('load', () => {
    console.log('Samsung DeX Web Simulator - Starting boot sequence...');
    
    // Animate boot progress bar
    const progressBar = document.querySelector('.boot-progress-bar');
    if (progressBar) {
        progressBar.style.width = '100%';
    }
    
    // Load saved settings
    loadSavedSettings();
    
    // Boot complete after 3 seconds
    setTimeout(() => {
        bootScreen.style.opacity = '0';
        bootScreen.style.visibility = 'hidden';
        
        // Show desktop
        desktop.classList.remove('hidden');
        
        // Update clock immediately
        updateClock();
        updateDate();
        
        console.log('Boot complete! Desktop ready.');
        
        // Add some sample desktop icons
        createDesktopIcons();
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Show welcome hint
        setTimeout(() => {
            showWelcomeHint();
        }, 1000);
    }, 3000);
});

// ===== CLOCK & DATE =====
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    clockElement.textContent = timeString;
}

function updateDate() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    dateElement.textContent = dateString;
}

// Update clock every minute
setInterval(updateClock, 60000);
setInterval(updateDate, 3600000); // Update date every hour

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // App Drawer
    appDrawerBtn.addEventListener('click', toggleAppDrawer);
    closeDrawerBtn.addEventListener('click', () => {
        appDrawer.classList.add('hidden');
    });
    
    // Quick Settings
    quickSettingsBtn.addEventListener('click', toggleQuickSettings);
    closeSettingsBtn.addEventListener('click', () => {
        quickSettings.classList.add('hidden');
    });
    
    // Home button
    homeBtn.addEventListener('click', () => {
        // Minimize all windows
        document.querySelectorAll('.window').forEach(window => {
            window.classList.add('hidden');
        });
        
        // Update taskbar
        updateTaskbar();
    });
    
    // Desktop icons
    document.querySelectorAll('.desktop-icon, .app-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const appName = this.getAttribute('data-app');
            launchApp(appName);
            
            // Close app drawer if open
            if (appDrawer.classList.contains('hidden') === false) {
                appDrawer.classList.add('hidden');
            }
        });
    });
    
    // Quick settings toggles
    document.getElementById('wifi-toggle').addEventListener('change', function() {
        showNotification(this.checked ? 'Wi-Fi enabled' : 'Wi-Fi disabled');
    });
    
    document.getElementById('bluetooth-toggle').addEventListener('change', function() {
        showNotification(this.checked ? 'Bluetooth enabled' : 'Bluetooth disabled');
    });
    
    document.getElementById('darkmode-toggle').addEventListener('change', function() {
        document.body.classList.toggle('light-mode', !this.checked);
        localStorage.setItem('dex-darkmode', this.checked);
        showNotification(this.checked ? 'Dark mode enabled' : 'Light mode enabled');
    });
    
    // Volume slider
    document.getElementById('volume-slider').addEventListener('input', function() {
        // In a real app, you would control actual audio here
        console.log('Volume set to:', this.value + '%');
    });
    
    // Brightness slider
    document.getElementById('brightness-slider').addEventListener('input', function() {
        // Visual brightness effect
        document.body.style.filter = `brightness(${this.value}%)`;
        localStorage.setItem('dex-brightness', this.value);
    });
    
    // Wallpaper buttons
    document.querySelectorAll('.wallpaper-option').forEach(button => {
        button.addEventListener('click', function() {
            const wallpaperId = this.getAttribute('data-wallpaper');
            changeWallpaper(wallpaperId);
            
            // Update active state
            document.querySelectorAll('.wallpaper-option').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Close settings when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#quick-settings') && 
            !event.target.closest('#quick-settings-btn') &&
            !quickSettings.classList.contains('hidden')) {
            quickSettings.classList.add('hidden');
        }
        
        if (!event.target.closest('#app-drawer') && 
            !event.target.closest('#app-drawer-btn') &&
            !appDrawer.classList.contains('hidden')) {
            appDrawer.classList.add('hidden');
        }
    });
}

// ===== APP DRAWER FUNCTIONS =====
function toggleAppDrawer() {
    if (appDrawer.classList.contains('hidden')) {
        appDrawer.classList.remove('hidden');
        // Bring to front
        appDrawer.style.zIndex = ++zIndexCounter;
    } else {
        appDrawer.classList.add('hidden');
    }
}

// ===== QUICK SETTINGS FUNCTIONS =====
function toggleQuickSettings() {
    if (quickSettings.classList.contains('hidden')) {
        quickSettings.classList.remove('hidden');
        // Bring to front
        quickSettings.style.zIndex = ++zIndexCounter;
    } else {
        quickSettings.classList.add('hidden');
    }
}

// ===== APP LAUNCHER =====
function launchApp(appName) {
    console.log('Launching app:', appName);
    
    // Check if app is already running
    const existingWindow = document.querySelector(`.window[data-app="${appName}"]`);
    if (existingWindow) {
        // Bring to front
        existingWindow.classList.remove('hidden');
        existingWindow.style.zIndex = ++zIndexCounter;
        
        // Update taskbar
        updateTaskbarApp(existingWindow, appName);
        return;
    }
    
    // Create new window
    const windowId = `window-${appName}-${Date.now()}`;
    const windowElement = createWindow(appName, windowId);
    
    // Position window (staggered)
    const windows = document.querySelectorAll('.window');
    const offset = 30 * windows.length;
    windowElement.style.top = `${100 + offset}px`;
    windowElement.style.left = `${100 + offset}px`;
    
    // Add to window area
    windowArea.appendChild(windowElement);
    
    // Track window
    activeWindows.set(windowId, {
        id: windowId,
        app: appName,
        element: windowElement,
        minimized: false
    });
    
    // Add to running apps
    if (!runningApps.includes(appName)) {
        runningApps.push(appName);
    }
    
    // Update taskbar
    createTaskbarApp(appName, windowElement);
    
    // Show notification
    showNotification(`Opening ${getAppDisplayName(appName)}`);
}

function createWindow(appName, windowId) {
    const windowElement = document.createElement('div');
    windowElement.className = 'window';
    windowElement.id = windowId;
    windowElement.setAttribute('data-app', appName);
    windowElement.style.zIndex = ++zIndexCounter;
    
    // Get app-specific content
    const appContent = getAppContent(appName);
    
    // Window template
    windowElement.innerHTML = `
        <div class="window-header">
            <div class="window-title">
                <i class="${getAppIcon(appName)}"></i>
                <span>${getAppDisplayName(appName)}</span>
            </div>
            <div class="window-controls">
                <button class="window-btn min-btn" title="Minimize">−</button>
                <button class="window-btn max-btn" title="Maximize">□</button>
                <button class="window-btn close-btn" title="Close">×</button>
            </div>
        </div>
        <div class="window-content">
            ${appContent}
        </div>
    `;
    
    // Add window controls functionality
    const minBtn = windowElement.querySelector('.min-btn');
    const maxBtn = windowElement.querySelector('.max-btn');
    const closeBtn = windowElement.querySelector('.close-btn');
    const header = windowElement.querySelector('.window-header');
    
    // Minimize button
    minBtn.addEventListener('click', () => {
        windowElement.classList.add('hidden');
        const windowData = activeWindows.get(windowId);
        if (windowData) {
            windowData.minimized = true;
        }
        updateTaskbar();
    });
    
    // Maximize button
    maxBtn.addEventListener('click', () => {
        if (windowElement.classList.contains('maximized')) {
            // Restore
            windowElement.classList.remove('maximized');
            windowElement.style.width = '600px';
            windowElement.style.height = '450px';
            windowElement.style.top = '50px';
            windowElement.style.left = '50px';
            maxBtn.title = 'Maximize';
        } else {
            // Maximize
            windowElement.classList.add('maximized');
            windowElement.style.width = 'calc(100% - 40px)';
            windowElement.style.height = 'calc(100% - 90px)';
            windowElement.style.top = '20px';
            windowElement.style.left = '20px';
            maxBtn.title = 'Restore';
        }
        windowElement.style.zIndex = ++zIndexCounter;
    });
    
    // Close button
    closeBtn.addEventListener('click', () => {
        closeWindow(windowId);
    });
    
    // Make window draggable
    makeDraggable(windowElement, header);
    
    // Focus window when clicked
    windowElement.addEventListener('mousedown', () => {
        focusWindow(windowElement);
    });
    
    // Initialize app-specific functionality
    initializeAppFunctionality(appName, windowElement);
    
    return windowElement;
}

// ===== WINDOW MANAGEMENT =====
function makeDraggable(windowElement, header) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    header.addEventListener('mousedown', startDrag);
    
    function startDrag(e) {
        // Don't drag if clicking on buttons
        if (e.target.closest('.window-btn')) return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = windowElement.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        // Bring to front
        focusWindow(windowElement);
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Calculate new position
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        // Keep window within bounds
        const maxX = window.innerWidth - windowElement.offsetWidth;
        const maxY = window.innerHeight - windowElement.offsetHeight - 50; // Account for taskbar
        
        newLeft = Math.max(0, Math.min(newLeft, maxX));
        newTop = Math.max(0, Math.min(newTop, maxY));
        
        windowElement.style.left = `${newLeft}px`;
        windowElement.style.top = `${newTop}px`;
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }
}

function focusWindow(windowElement) {
    windowElement.style.zIndex = ++zIndexCounter;
}

function closeWindow(windowId) {
    const windowData = activeWindows.get(windowId);
    if (windowData) {
        // Remove from active windows
        activeWindows.delete(windowId);
        
        // Remove from running apps if no other windows of this app
        const appName = windowData.app;
        const otherWindowsOfApp = Array.from(activeWindows.values()).filter(
            win => win.app === appName
        );
        
        if (otherWindowsOfApp.length === 0) {
            runningApps = runningApps.filter(app => app !== appName);
        }
        
        // Remove window element
        windowData.element.remove();
        
        // Remove from taskbar
        removeTaskbarApp(appName);
        
        // Show notification
        showNotification(`${getAppDisplayName(appName)} closed`);
    }
}

// ===== TASKBAR MANAGEMENT =====
function createTaskbarApp(appName, windowElement) {
    // Check if already in taskbar
    if (document.getElementById(`taskbar-app-${appName}`)) {
        updateTaskbarApp(windowElement, appName);
        return;
    }
    
    const taskbarApp = document.createElement('button');
    taskbarApp.className = 'taskbar-app';
    taskbarApp.id = `taskbar-app-${appName}`;
    taskbarApp.innerHTML = `
        <i class="${getAppIcon(appName)}"></i>
        <span>${getAppDisplayName(appName)}</span>
    `;
    
    taskbarApp.addEventListener('click', () => {
        const windowElement = document.querySelector(`.window[data-app="${appName}"]`);
        if (windowElement) {
            if (windowElement.classList.contains('hidden')) {
                // Restore window
                windowElement.classList.remove('hidden');
                windowElement.style.zIndex = ++zIndexCounter;
                const windowData = activeWindows.get(windowElement.id);
                if (windowData) {
                    windowData.minimized = false;
                }
            } else {
                // Minimize window
                windowElement.classList.add('hidden');
                const windowData = activeWindows.get(windowElement.id);
                if (windowData) {
                    windowData.minimized = true;
                }
            }
            updateTaskbar();
        }
    });
    
    taskbarCenter.appendChild(taskbarApp);
    updateTaskbar();
}

function updateTaskbarApp(windowElement, appName) {
    const taskbarApp = document.getElementById(`taskbar-app-${appName}`);
    if (taskbarApp) {
        if (windowElement.classList.contains('hidden')) {
            taskbarApp.classList.remove('active');
        } else {
            taskbarApp.classList.add('active');
        }
    }
}

function removeTaskbarApp(appName) {
    const taskbarApp = document.getElementById(`taskbar-app-${appName}`);
    if (taskbarApp) {
        taskbarApp.remove();
    }
}

function updateTaskbar() {
    // Update all taskbar app buttons
    document.querySelectorAll('.taskbar-app').forEach(btn => {
        const appName = btn.id.replace('taskbar-app-', '');
        const windowElement = document.querySelector(`.window[data-app="${appName}"]`);
        
        if (windowElement) {
            if (windowElement.classList.contains('hidden')) {
                btn.classList.remove('active');
            } else {
                btn.classList.add('active');
            }
        } else {
            btn.classList.remove('active');
        }
    });
}

// ===== APP CONTENT GENERATORS =====
function getAppContent(appName) {
    switch (appName) {
        case 'files':
            return getFilesAppContent();
        case 'browser':
            return getBrowserAppContent();
        case 'settings':
            return getSettingsAppContent();
        case 'terminal':
            return getTerminalAppContent();
        case 'calculator':
            return getCalculatorAppContent();
        case 'notes':
            return getNotesAppContent();
        case 'gallery':
            return getGalleryAppContent();
        case 'music':
            return getMusicAppContent();
        default:
            return `<p>App "${appName}" is under development.</p>`;
    }
}

function getAppIcon(appName) {
    const icons = {
        'files': 'fas fa-folder',
        'browser': 'fas fa-globe',
        'settings': 'fas fa-cog',
        'terminal': 'fas fa-terminal',
        'calculator': 'fas fa-calculator',
        'notes': 'fas fa-sticky-note',
        'gallery': 'fas fa-images',
        'music': 'fas fa-music'
    };
    return icons[appName] || 'fas fa-question-circle';
}

function getAppDisplayName(appName) {
    const names = {
        'files': 'My Files',
        'browser': 'Internet',
        'settings': 'Settings',
        'terminal': 'Terminal',
        'calculator': 'Calculator',
        'notes': 'Notes',
        'gallery': 'Gallery',
        'music': 'Music Player'
    };
    return names[appName] || appName;
}

// ===== INDIVIDUAL APPS =====

// Files App
function getFilesAppContent() {
    return `
        <div class="files-container">
            <div class="files-sidebar">
                <h3 style="margin-bottom: 15px; color: #007aff;">Places</h3>
                <div class="file-item">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-desktop"></i>
                    <span>Desktop</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-download"></i>
                    <span>Downloads</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-file"></i>
                    <span>Documents</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-image"></i>
                    <span>Pictures</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-music"></i>
                    <span>Music</span>
                </div>
            </div>
            <div class="files-content">
                <h3 style="margin-bottom: 15px;">Recent Files</h3>
                <div class="file-item">
                    <i class="fas fa-file-alt"></i>
                    <span>project_notes.txt</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-image"></i>
                    <span>wallpaper.jpg</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-file-pdf"></i>
                    <span>document.pdf</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-folder"></i>
                    <span>DeX Project</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-file-code"></i>
                    <span>script.js</span>
                </div>
            </div>
        </div>
    `;
}

// Browser App
function getBrowserAppContent() {
    return `
        <div class="browser-container">
            <div class="browser-url-bar">
                <input type="text" class="url-input" value="https://dex.samsung.com" placeholder="Enter URL or search...">
                <button class="url-btn" id="browser-go-btn">Go</button>
                <button class="url-btn" id="browser-refresh-btn">
                    <i class="fas fa-redo"></i>
                </button>
            </div>
            <div class="browser-content" id="browser-frame">
                <div style="padding: 20px; text-align: center;">
                    <h3>Samsung DeX</h3>
                    <p>Transform your phone into a desktop experience</p>
                    <p style="margin-top: 20px; color: rgba(255,255,255,0.6);">
                        <i>Browser simulation - In a real implementation, this would be an iframe</i>
                    </p>
                    <div style="margin-top: 30px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                        <div style="padding: 15px; background: rgba(0,122,255,0.1); border-radius: 8px;">
                            <i class="fas fa-tv" style="font-size: 24px; color: #007aff;"></i>
                            <p style="margin-top: 10px;">Desktop Experience</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0,122,255,0.1); border-radius: 8px;">
                            <i class="fas fa-mouse-pointer" style="font-size: 24px; color: #007aff;"></i>
                            <p style="margin-top: 10px;">Mouse & Keyboard Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Settings App
function getSettingsAppContent() {
    return `
        <div class="settings-container">
            <div class="settings-nav">
                <h3 style="margin-bottom: 20px; color: #007aff;">Settings</h3>
                <div class="file-item active">
                    <i class="fas fa-palette"></i>
                    <span>Personalization</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-desktop"></i>
                    <span>Display</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-volume-up"></i>
                    <span>Sound</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-network-wired"></i>
                    <span>Network</span>
                </div>
                <div class="file-item">
                    <i class="fas fa-shield-alt"></i>
                    <span>Security</span>
                </div>
            </div>
            <div class="files-content">
                <h3 style="margin-bottom: 20px;">Personalization</h3>
                
                <div class="settings-section">
                    <h4 style="margin-bottom: 15px; color: rgba(255,255,255,0.9);">Wallpaper</h4>
                    <div class="wallpaper-options">
                        <button class="wallpaper-option" data-settings-wallpaper="1" style="background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);"></button>
                        <button class="wallpaper-option" data-settings-wallpaper="2" style="background: linear-gradient(135deg, #1e3c72, #2a5298);"></button>
                        <button class="wallpaper-option" data-settings-wallpaper="3" style="background: linear-gradient(135deg, #42275a, #734b6d);"></button>
                        <button class="wallpaper-option" data-settings-wallpaper="4" style="background: linear-gradient(135deg, #141e30, #243b55);"></button>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h4 style="margin-bottom: 15px; color: rgba(255,255,255,0.9);">Theme</h4>
                    <div class="settings-option">
                        <span>Dark Mode</span>
                        <label class="switch">
                            <input type="checkbox" id="settings-darkmode" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="settings-option">
                        <span>Accent Color</span>
                        <select style="background: rgba(255,255,255,0.07); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 6px;">
                            <option>Blue (Default)</option>
                            <option>Red</option>
                            <option>Green</option>
                            <option>Purple</option>
                        </select>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h4 style="margin-bottom: 15px; color: rgba(255,255,255,0.9);">Taskbar</h4>
                    <div class="settings-option">
                        <span>Auto-hide taskbar</span>
                        <label class="switch">
                            <input type="checkbox" id="autohide-taskbar">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="settings-option">
                        <span>Taskbar position</span>
                        <select style="background: rgba(255,255,255,0.07); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 6px;">
                            <option>Bottom</option>
                            <option>Top</option>
                            <option>Left</option>
                            <option>Right</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Terminal App
function getTerminalAppContent() {
    return `
        <div class="terminal-container">
            <div class="terminal-line">Samsung DeX Web Terminal v1.0</div>
            <div class="terminal-line">Type 'help' for available commands</div>
            <div class="terminal-line"><br></div>
            <div class="terminal-line">user@dex-web:~$ <span class="terminal-output">Welcome to DeX Terminal</span></div>
            <div class="terminal-line">user@dex-web:~$ <span class="terminal-output">System: Web DeX Simulator</span></div>
            <div class="terminal-line">user@dex-web:~$ <span class="terminal-output">Uptime: ${Math.floor((Date.now() - performance.timing.navigationStart) / 1000)}s</span></div>
            <div class="terminal-line"><br></div>
            <div class="terminal-input">
                <span class="terminal-prompt">user@dex-web:~$</span>
                <input type="text" id="terminal-input" style="background: transparent; border: none; color: #00ff00; outline: none; flex: 1; font-family: 'Courier New', monospace; font-size: 14px;" autofocus>
                <span class="terminal-cursor" id="terminal-cursor"></span>
            </div>
        </div>
    `;
}

// Calculator App
function getCalculatorAppContent() {
    return `
        <div class="calculator-container">
            <div class="calculator-display" id="calc-display">0</div>
            <div class="calculator-buttons">
                <button class="calc-btn" data-calc="C">C</button>
                <button class="calc-btn" data-calc="±">±</button>
                <button class="calc-btn" data-calc="%">%</button>
                <button class="calc-btn operator" data-calc="/">÷</button>
                
                <button class="calc-btn" data-calc="7">7</button>
                <button class="calc-btn" data-calc="8">8</button>
                <button class="calc-btn" data-calc="9">9</button>
                <button class="calc-btn operator" data-calc="*">×</button>
                
                <button class="calc-btn" data-calc="4">4</button>
                <button class="calc-btn" data-calc="5">5</button>
                <button class="calc-btn" data-calc="6">6</button>
                <button class="calc-btn operator" data-calc="-">−</button>
                
                <button class="calc-btn" data-calc="1">1</button>
                <button class="calc-btn" data-calc="2">2</button>
                <button class="calc-btn" data-calc="3">3</button>
                <button class="calc-btn operator" data-calc="+">+</button>
                
                <button class="calc-btn" data-calc="0" style="grid-column: span 2;">0</button>
                <button class="calc-btn" data-calc=".">.</button>
                <button class="calc-btn operator" data-calc="=" style="background: #007aff; color: white;">=</button>
            </div>
        </div>
    `;
}

// Notes App
function getNotesAppContent() {
    return `
        <div class="notes-container">
            <div class="notes-list">
                <h3 style="margin-bottom: 15px; color: #007aff;">Notes</h3>
                <div class="note-item active">
                    <div class="note-title">Welcome to DeX</div>
                    <div class="note-date">Today</div>
                </div>
                <div class="note-item">
                    <div class="note-title">Project Ideas</div>
                    <div class="note-date">Jan 28</div>
                </div>
                <div class="note-item">
                    <div class="note-title">Shopping List</div>
                    <div class="note-date">Jan 25</div>
                </div>
                <div class="note-item">
                    <div class="note-title">Meeting Notes</div>
                    <div class="note-date">Jan 20</div>
                </div>
                <button class="url-btn" style="width: 100%; margin-top: 15px;">
                    <i class="fas fa-plus"></i> New Note
                </button>
            </div>
            <div class="note-editor">
                <h3 style="margin-bottom: 15px;">Welcome to DeX</h3>
                <textarea class="note-textarea" id="note-editor-textarea">
Welcome to Samsung DeX Web Simulator!

This is a web-based simulation of the Samsung DeX experience.

Features:
• Desktop-like interface
• Resizable windows
• Multiple applications
• Taskbar with running apps
• Quick settings panel
• Fully interactive

You can:
- Launch apps from the app drawer
- Resize and move windows
- Use the taskbar to switch between apps
- Change settings and wallpaper
- Experience a desktop environment in your browser

Enjoy exploring!
                </textarea>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="url-btn">Save</button>
                    <button class="url-btn" style="background: rgba(255,255,255,0.07);">Delete</button>
                </div>
            </div>
        </div>
    `;
}

// Gallery App
function getGalleryAppContent() {
    return `
        <div style="padding: 10px;">
            <h3 style="margin-bottom: 15px; color: #007aff;">Gallery</h3>
            <p style="margin-bottom: 20px; color: rgba(255,255,255,0.7);">Your photos and images</p>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                <div style="aspect-ratio: 1; background: linear-gradient(135deg, #0f2027, #2c5364); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-mountain" style="font-size: 30px; color: rgba(255,255,255,0.5);"></i>
                </div>
                <div style="aspect-ratio: 1; background: linear-gradient(135deg, #42275a, #734b6d); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-palette" style="font-size: 30px; color: rgba(255,255,255,0.5);"></i>
                </div>
                <div style="aspect-ratio: 1; background: linear-gradient(135deg, #1e3c72, #2a5298); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-cloud" style="font-size: 30px; color: rgba(255,255,255,0.5);"></i>
                </div>
                <div style="aspect-ratio: 1; background: linear-gradient(135deg, #141e30, #243b55); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-city" style="font-size: 30px; color: rgba(255,255,255,0.5);"></i>
                </div>
                <div style="aspect-ratio: 1; background: linear-gradient(135deg, #3a1c71, #d76d77); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-sunset" style="font-size: 30px; color: rgba(255,255,255,0.5);"></i>
                </div>
                <div style="aspect-ratio: 1; background: linear-gradient(135deg, #2193b0, #6dd5ed); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-water" style="font-size: 30px; color: rgba(255,255,255,0.5);"></i>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <button class="url-btn">
                    <i class="fas fa-upload"></i> Upload Images
                </button>
                <button class="url-btn" style="background: rgba(255,255,255,0.07); margin-left: 10px;">
                    <i class="fas fa-sliders-h"></i> Slideshow
                </button>
            </div>
        </div>
    `;
}

// Music App
function getMusicAppContent() {
    return `
        <div style="padding: 10px;">
            <h3 style="margin-bottom: 15px; color: #007aff;">Music Player</h3>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #007aff, #00c6ff); border-radius: 10px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-music" style="font-size: 60px; color: white;"></i>
                </div>
                <h3 style="margin-bottom: 5px;">DeX Simulation Theme</h3>
                <p style="color: rgba(255,255,255,0.6);">Samsung DeX · 2024</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 10px;">
                    <div style="width: 30%; height: 100%; background: #007aff; border-radius: 2px;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: rgba(255,255,255,0.6);">
                    <span>1:15</span>
                    <span>3:45</span>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 30px;">
                <button class="window-btn" style="width: 40px; height: 40px;">
                    <i class="fas fa-step-backward"></i>
                </button>
                <button class="window-btn" style="width: 60px; height: 60px; background: #007aff;">
                    <i class="fas fa-play"></i>
                </button>
                <button class="window-btn" style="width: 40px; height: 40px;">
                    <i class="fas fa-step-forward"></i>
                </button>
            </div>
            
            <div style="display: flex; align-items: center; gap: 15px;">
                <i class="fas fa-volume-down" style="color: rgba(255,255,255,0.6);"></i>
                <div style="flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px;">
                    <div style="width: 75%; height: 100%; background: #007aff; border-radius: 2px;"></div>
                </div>
                <i class="fas fa-volume-up" style="color: rgba(255,255,255,0.6);"></i>
            </div>
            
            <div style="margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 15px;">
                <h4 style="margin-bottom: 10px;">Playlist</h4>
                <div style="display: flex; align-items: center; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 8px;">
                    <i class="fas fa-play" style="margin-right: 10px; color: #007aff;"></i>
                    <span>DeX Interface Sounds</span>
                </div>
                <div style="display: flex; align-items: center; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 8px;">
                    <i class="fas fa-music" style="margin-right: 10px;"></i>
                    <span>Startup Theme</span>
                </div>
                <div style="display: flex; align-items: center; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                    <i class="fas fa-music" style="margin-right: 10px;"></i>
                    <span>Notification Sounds</span>
                </div>
            </div>
        </div>
    `;
}

// ===== APP-SPECIFIC INITIALIZATION =====
function initializeAppFunctionality(appName, windowElement) {
    switch (appName) {
        case 'browser':
            initBrowserApp(windowElement);
            break;
        case 'terminal':
            initTerminalApp(windowElement);
            break;
        case 'calculator':
            initCalculatorApp(windowElement);
            break;
        case 'settings':
            initSettingsApp(windowElement);
            break;
        case 'notes':
            initNotesApp(windowElement);
            break;
    }
}

function initBrowserApp(windowElement) {
    const goBtn = windowElement.querySelector('#browser-go-btn');
    const refreshBtn = windowElement.querySelector('#browser-refresh-btn');
    const urlInput = windowElement.querySelector('.url-input');
    
    goBtn.addEventListener('click', () => {
        const url = urlInput.value;
        if (url) {
            showNotification(`Navigating to ${url}`);
            // In a real implementation, you would load the URL in an iframe
        }
    });
    
    refreshBtn.addEventListener('click', () => {
        showNotification('Refreshing browser...');
    });
    
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            goBtn.click();
        }
    });
}

function initTerminalApp(windowElement) {
    const terminalInput = windowElement.querySelector('#terminal-input');
    const terminalContainer = windowElement.querySelector('.terminal-container');
    
    if (terminalInput) {
        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                terminalInput.value = '';
                
                // Add command to terminal history
                const commandLine = document.createElement('div');
                commandLine.className = 'terminal-line';
                commandLine.innerHTML = `<span class="terminal-prompt">user@dex-web:~$</span> ${command}`;
                terminalContainer.insertBefore(commandLine, terminalContainer.querySelector('.terminal-input'));
                
                // Process command
                processTerminalCommand(command, terminalContainer);
                
                // Scroll to bottom
                terminalContainer.scrollTop = terminalContainer.scrollHeight;
            }
        });
    }
}

function processTerminalCommand(command, terminalContainer) {
    const output = document.createElement('div');
    output.className = 'terminal-line';
    
    let response = '';
    
    switch (command.toLowerCase()) {
        case '':
            return;
        case 'help':
            response = 'Available commands: help, clear, about, date, apps, echo [text]';
            break;
        case 'clear':
            // Clear terminal
            const lines = terminalContainer.querySelectorAll('.terminal-line');
            lines.forEach(line => {
                if (!line.classList.contains('terminal-input') && !line.querySelector('.terminal-prompt')) {
                    line.remove();
                }
            });
            return;
        case 'about':
            response = 'Samsung DeX Web Simulator v1.0 | A web-based DeX experience simulation';
            break;
        case 'date':
            response = new Date().toString();
            break;
        case 'apps':
            response = `Running apps: ${runningApps.join(', ') || 'None'}`;
            break;
        case 'echo':
            response = 'Usage: echo [text]';
            break;
        default:
            if (command.toLowerCase().startsWith('echo ')) {
                response = command.substring(5);
            } else {
                response = `Command not found: ${command}. Type 'help' for available commands.`;
            }
    }
    
    output.innerHTML = `<span class="terminal-output">${response}</span>`;
    terminalContainer.insertBefore(output, terminalContainer.querySelector('.terminal-input'));
}

function initCalculatorApp(windowElement) {
    const display = windowElement.querySelector('#calc-display');
    const buttons = windowElement.querySelectorAll('.calc-btn');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetScreen = false;
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-calc');
            handleCalculatorInput(value);
        });
    });
    
    function handleCalculatorInput(value) {
        if (value >= '0' && value <= '9') {
            // Number input
            if (currentInput === '0' || resetScreen) {
                currentInput = value;
                resetScreen = false;
            } else {
                currentInput += value;
            }
        } else if (value === '.') {
            // Decimal point
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
        } else if (value === 'C') {
            // Clear
            currentInput = '0';
            previousInput = '';
            operation = null;
        } else if (value === '±') {
            // Plus/minus
            currentInput = (parseFloat(currentInput) * -1).toString();
        } else if (value === '%') {
            // Percentage
            currentInput = (parseFloat(currentInput) / 100).toString();
        } else if (['+', '-', '*', '/'].includes(value)) {
            // Operation
            if (previousInput !== '') {
                calculate();
            }
            operation = value;
            previousInput = currentInput;
            resetScreen = true;
        } else if (value === '=') {
            // Equals
            if (previousInput !== '' && operation !== null) {
                calculate();
                operation = null;
                previousInput = '';
            }
        }
        
        updateCalculatorDisplay();
    }
    
    function calculate() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            default:
                return;
        }
        
        currentInput = result.toString();
        resetScreen = true;
    }
    
    function updateCalculatorDisplay() {
        display.textContent = currentInput.length > 12 ? parseFloat(currentInput).toExponential(6) : currentInput;
    }
}

function initSettingsApp(windowElement) {
    // Wallpaper buttons in settings
    const wallpaperBtns = windowElement.querySelectorAll('[data-settings-wallpaper]');
    wallpaperBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const wallpaperId = btn.getAttribute('data-settings-wallpaper');
            changeWallpaper(wallpaperId);
            showNotification(`Wallpaper changed to ${wallpaperId}`);
        });
    });
    
    // Dark mode toggle in settings
    const darkmodeToggle = windowElement.querySelector('#settings-darkmode');
    if (darkmodeToggle) {
        darkmodeToggle.addEventListener('change', function() {
            document.body.classList.toggle('light-mode', !this.checked);
            localStorage.setItem('dex-darkmode', this.checked);
            showNotification(this.checked ? 'Dark mode enabled' : 'Light mode enabled');
        });
    }
}

function initNotesApp(windowElement) {
    const noteItems = windowElement.querySelectorAll('.note-item');
    const textarea = windowElement.querySelector('#note-editor-textarea');
    
    noteItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            noteItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            // Update editor title
            const title = windowElement.querySelector('.note-editor h3');
            const noteTitle = item.querySelector('.note-title').textContent;
            title.textContent = noteTitle;
            
            // Update textarea content based on selected note
            // In a real app, you would load the actual note content
        });
    });
    
    const saveBtn = windowElement.querySelector('.url-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            showNotification('Note saved');
        });
    }
}

// ===== SYSTEM FUNCTIONS =====
function changeWallpaper(wallpaperId) {
    const wallpapers = {
        '1': 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        '2': 'linear-gradient(135deg, #1e3c72, #2a5298)',
        '3': 'linear-gradient(135deg, #42275a, #734b6d)',
        '4': 'linear-gradient(135deg, #141e30, #243b55)'
    };
    
    const wallpaper = wallpapers[wallpaperId] || wallpapers['1'];
    wallpaperElement.style.background = wallpaper;
    
    // Save to localStorage
    localStorage.setItem('dex-wallpaper', wallpaperId);
}

function loadSavedSettings() {
    // Load wallpaper
    const savedWallpaper = localStorage.getItem('dex-wallpaper') || '1';
    changeWallpaper(savedWallpaper);
    
    // Load dark mode
    const savedDarkmode = localStorage.getItem('dex-darkmode');
    if (savedDarkmode !== null) {
        const darkmodeToggle = document.getElementById('darkmode-toggle');
        if (darkmodeToggle) {
            darkmodeToggle.checked = savedDarkmode === 'true';
            document.body.classList.toggle('light-mode', !darkmodeToggle.checked);
        }
    }
    
    // Load brightness
    const savedBrightness = localStorage.getItem('dex-brightness');
    if (savedBrightness) {
        const brightnessSlider = document.getElementById('brightness-slider');
        if (brightnessSlider) {
            brightnessSlider.value = savedBrightness;
            document.body.style.filter = `brightness(${savedBrightness}%)`;
        }
    }
    
    // Set active wallpaper button
    setTimeout(() => {
        const wallpaperOptions = document.querySelectorAll('.wallpaper-option');
        wallpaperOptions.forEach(btn => {
            if (btn.getAttribute('data-wallpaper') === savedWallpaper) {
                btn.classList.add('active');
            }
        });
    }, 100);
}

function showNotification(message, duration = 3000) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(30, 35, 45, 0.9);
            backdrop-filter: blur(10px);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            font-size: 14px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            border: 1px solid rgba(255,255,255,0.08);
            z-index: 1000;
            animation: fadeInUp 0.3s ease;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
}

function createDesktopIcons() {
    // Desktop icons are already in HTML
    // This function could be used to dynamically create more icons
}

function showWelcomeHint() {
    showNotification('Welcome to Samsung DeX Web Simulator! Click the menu button to launch apps.', 5000);
}

// ===== STARTUP =====
// Initialize immediately
updateClock();
updateDate();

// Start clock updates
setInterval(updateClock, 1000);

// Log startup
console.log('Samsung DeX Web Simulator - Script loaded successfully');
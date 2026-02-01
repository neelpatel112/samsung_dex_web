/* ===== ADVANCED SAMSUNG DEX FEATURES ===== */

// ===== MULTI-WINDOW SNAPPING =====
class WindowSnapper {
    constructor() {
        this.snapZones = {
            left: { x: 0, width: '50%', height: '100%' },
            right: { x: '50%', width: '50%', height: '100%' },
            top: { x: 0, y: 0, width: '100%', height: '50%' },
            bottom: { x: 0, y: '50%', width: '100%', height: '50%' },
            topLeft: { x: 0, y: 0, width: '50%', height: '50%' },
            topRight: { x: '50%', y: 0, width: '50%', height: '50%' },
            bottomLeft: { x: 0, y: '50%', width: '50%', height: '50%' },
            bottomRight: { x: '50%', y: '50%', width: '50%', height: '50%' }
        };
        
        this.initSnapGuides();
    }
    
    initSnapGuides() {
        const guideHTML = `
            <div class="snap-guides">
                <div class="snap-vertical"></div>
                <div class="snap-horizontal"></div>
                <div class="snap-top-left"></div>
                <div class="snap-top-right"></div>
                <div class="snap-bottom-left"></div>
                <div class="snap-bottom-right"></div>
            </div>
        `;
        
        document.getElementById('window-area').insertAdjacentHTML('beforeend', guideHTML);
    }
    
    enableSnapping(windowElement) {
        let isSnapping = false;
        let snapZone = null;
        
        windowElement.addEventListener('mousemove', (e) => {
            if (!windowElement.classList.contains('dragging')) return;
            
            const rect = windowElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Check which snap zone we're near
            const windowArea = document.getElementById('window-area').getBoundingClientRect();
            
            // Left snap
            if (centerX < windowArea.width * 0.25) {
                snapZone = 'left';
                this.showSnapGuide('left');
            }
            // Right snap
            else if (centerX > windowArea.width * 0.75) {
                snapZone = 'right';
                this.showSnapGuide('right');
            }
            // Top snap
            else if (centerY < windowArea.height * 0.25) {
                snapZone = 'top';
                this.showSnapGuide('top');
            }
            // Bottom snap
            else if (centerY > windowArea.height * 0.75) {
                snapZone = 'bottom';
                this.showSnapGuide('bottom');
            }
            // Corners
            else if (centerX < windowArea.width * 0.25 && centerY < windowArea.height * 0.25) {
                snapZone = 'topLeft';
                this.showSnapGuide('topLeft');
            }
            else if (centerX > windowArea.width * 0.75 && centerY < windowArea.height * 0.25) {
                snapZone = 'topRight';
                this.showSnapGuide('topRight');
            }
            else if (centerX < windowArea.width * 0.25 && centerY > windowArea.height * 0.75) {
                snapZone = 'bottomLeft';
                this.showSnapGuide('bottomLeft');
            }
            else if (centerX > windowArea.width * 0.75 && centerY > windowArea.height * 0.75) {
                snapZone = 'bottomRight';
                this.showSnapGuide('bottomRight');
            }
            else {
                snapZone = null;
                this.hideSnapGuides();
            }
        });
        
        windowElement.addEventListener('mouseup', () => {
            if (snapZone && this.snapZones[snapZone]) {
                this.snapWindow(windowElement, snapZone);
            }
            this.hideSnapGuides();
        });
    }
    
    showSnapGuide(zone) {
        const guides = document.querySelector('.snap-guides');
        guides.classList.add('visible', `snap-${zone}`);
    }
    
    hideSnapGuides() {
        const guides = document.querySelector('.snap-guides');
        guides.classList.remove('visible');
        guides.className = 'snap-guides'; // Reset all zone classes
    }
    
    snapWindow(windowElement, zone) {
        const zoneConfig = this.snapZones[zone];
        const windowArea = document.getElementById('window-area');
        const areaRect = windowArea.getBoundingClientRect();
        
        // Calculate actual pixel values
        const x = typeof zoneConfig.x === 'string' 
            ? areaRect.width * (parseInt(zoneConfig.x) / 100)
            : zoneConfig.x;
            
        const y = typeof zoneConfig.y === 'string'
            ? areaRect.height * (parseInt(zoneConfig.y) / 100)
            : zoneConfig.y || 0;
            
        const width = typeof zoneConfig.width === 'string'
            ? areaRect.width * (parseInt(zoneConfig.width) / 100)
            : zoneConfig.width;
            
        const height = typeof zoneConfig.height === 'string'
            ? areaRect.height * (parseInt(zoneConfig.height) / 100)
            : zoneConfig.height;
        
        // Apply snap position
        windowElement.style.left = `${x}px`;
        windowElement.style.top = `${y}px`;
        windowElement.style.width = `${width}px`;
        windowElement.style.height = `${height}px`;
        
        // Remove maximized class if exists
        windowElement.classList.remove('maximized');
        
        // Show notification
        showNotification(`Window snapped to ${zone.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    }
}

// ===== VIRTUAL DESKTOPS =====
class VirtualDesktopManager {
    constructor() {
        this.desktops = [];
        this.currentDesktopIndex = 0;
        this.maxDesktops = 4;
        
        this.init();
    }
    
    init() {
        // Create initial desktop
        this.createDesktop('Desktop 1');
        
        // Add taskbar controls
        this.addTaskbarControls();
    }
    
    createDesktop(name) {
        const desktop = {
            id: this.desktops.length,
            name: name || `Desktop ${this.desktops.length + 1}`,
            windows: [],
            wallpaper: '1'
        };
        
        this.desktops.push(desktop);
        return desktop;
    }
    
    switchDesktop(index) {
        if (index >= 0 && index < this.desktops.length) {
            // Hide all windows from current desktop
            this.hideDesktopWindows(this.currentDesktopIndex);
            
            // Update current index
            this.currentDesktopIndex = index;
            
            // Show windows from new desktop
            this.showDesktopWindows(index);
            
            // Update taskbar
            this.updateTaskbarDisplay();
            
            // Animation
            this.animateDesktopSwitch();
            
            showNotification(`Switched to ${this.desktops[index].name}`);
        }
    }
    
    hideDesktopWindows(desktopIndex) {
        const desktop = this.desktops[desktopIndex];
        if (!desktop) return;
        
        // Store current window positions and hide them
        desktop.windows.forEach(windowId => {
            const windowElement = document.getElementById(windowId);
            if (windowElement) {
                // Store current position before hiding
                const rect = windowElement.getBoundingClientRect();
                desktop.windowPositions = desktop.windowPositions || {};
                desktop.windowPositions[windowId] = {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                };
                
                windowElement.classList.add('hidden');
            }
        });
    }
    
    showDesktopWindows(desktopIndex) {
        const desktop = this.desktops[desktopIndex];
        if (!desktop) return;
        
        // Show windows with their stored positions
        desktop.windows.forEach(windowId => {
            const windowElement = document.getElementById(windowId);
            if (windowElement) {
                windowElement.classList.remove('hidden');
                
                // Restore position if available
                if (desktop.windowPositions && desktop.windowPositions[windowId]) {
                    const pos = desktop.windowPositions[windowId];
                    windowElement.style.left = `${pos.left}px`;
                    windowElement.style.top = `${pos.top}px`;
                    windowElement.style.width = `${pos.width}px`;
                    windowElement.style.height = `${pos.height}px`;
                }
            }
        });
    }
    
    addTaskbarControls() {
        // Add desktop switcher to taskbar
        const desktopSwitcher = document.createElement('div');
        desktopSwitcher.className = 'desktop-switcher';
        desktopSwitcher.innerHTML = `
            <button class="taskbar-btn desktop-prev" title="Previous Desktop">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="desktop-indicator">
                <span class="current-desktop">Desktop 1</span>
            </div>
            <button class="taskbar-btn desktop-next" title="Next Desktop">
                <i class="fas fa-chevron-right"></i>
            </button>
            <button class="taskbar-btn add-desktop" title="Add New Desktop">
                <i class="fas fa-plus"></i>
            </button>
        `;
        
        document.querySelector('.taskbar-left').appendChild(desktopSwitcher);
        
        // Add event listeners
        document.querySelector('.desktop-prev').addEventListener('click', () => {
            this.prevDesktop();
        });
        
        document.querySelector('.desktop-next').addEventListener('click', () => {
            this.nextDesktop();
        });
        
        document.querySelector('.add-desktop').addEventListener('click', () => {
            this.addNewDesktop();
        });
    }
    
    prevDesktop() {
        const newIndex = (this.currentDesktopIndex - 1 + this.desktops.length) % this.desktops.length;
        this.switchDesktop(newIndex);
    }
    
    nextDesktop() {
        const newIndex = (this.currentDesktopIndex + 1) % this.desktops.length;
        this.switchDesktop(newIndex);
    }
    
    addNewDesktop() {
        if (this.desktops.length < this.maxDesktops) {
            const newDesktop = this.createDesktop(`Desktop ${this.desktops.length}`);
            showNotification(`Created ${newDesktop.name}`);
        } else {
            showNotification(`Maximum ${this.maxDesktops} desktops reached`);
        }
    }
    
    updateTaskbarDisplay() {
        const indicator = document.querySelector('.current-desktop');
        if (indicator) {
            indicator.textContent = this.desktops[this.currentDesktopIndex].name;
        }
    }
    
    animateDesktopSwitch() {
        const desktop = document.getElementById('desktop');
        desktop.style.transform = 'scale(0.95)';
        desktop.style.opacity = '0.8';
        
        setTimeout(() => {
            desktop.style.transform = 'scale(1)';
            desktop.style.opacity = '1';
        }, 150);
    }
}

// ===== KEYBOARD SHORTCUTS =====
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.init();
    }
    
    init() {
        // Define shortcuts
        this.registerShortcuts();
        
        // Add keyboard listener
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    registerShortcuts() {
        // App launching shortcuts
        this.shortcuts.set('Alt+1', () => launchApp('files'));
        this.shortcuts.set('Alt+2', () => launchApp('browser'));
        this.shortcuts.set('Alt+3', () => launchApp('settings'));
        this.shortcuts.set('Alt+4', () => launchApp('terminal'));
        
        // Window management
        this.shortcuts.set('Alt+Tab', () => this.switchWindows());
        this.shortcuts.set('Alt+F4', () => this.closeActiveWindow());
        this.shortcuts.set('Win+D', () => this.showDesktop());
        this.shortcuts.set('Win+Left', () => this.snapWindow('left'));
        this.shortcuts.set('Win+Right', () => this.snapWindow('right'));
        this.shortcuts.set('Win+Up', () => this.snapWindow('top'));
        this.shortcuts.set('Win+Down', () => this.snapWindow('bottom'));
        
        // System
        this.shortcuts.set('Win+L', () => this.lockScreen());
        this.shortcuts.set('Win+E', () => launchApp('files'));
        this.shortcuts.set('Win+R', () => this.openRunDialog());
        
        // Virtual desktops
        this.shortcuts.set('Ctrl+Win+Left', () => window.desktopManager?.prevDesktop());
        this.shortcuts.set('Ctrl+Win+Right', () => window.desktopManager?.nextDesktop());
        this.shortcuts.set('Ctrl+Win+D', () => window.desktopManager?.addNewDesktop());
    }
    
    handleKeyDown(e) {
        // Build shortcut string
        const keys = [];
        if (e.ctrlKey) keys.push('Ctrl');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');
        if (e.metaKey || e.key === 'Meta') keys.push('Win');
        
        // Don't add modifier keys as main key
        if (!['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
            keys.push(e.key);
        }
        
        const shortcut = keys.join('+');
        
        // Check if shortcut exists
        if (this.shortcuts.has(shortcut)) {
            e.preventDefault();
            this.shortcuts.get(shortcut)();
            this.showShortcutHint(shortcut);
        }
    }
    
    switchWindows() {
        const windows = Array.from(document.querySelectorAll('.window:not(.hidden)'));
        if (windows.length > 0) {
            const currentIndex = windows.findIndex(w => parseInt(w.style.zIndex) === Math.max(...windows.map(w => parseInt(w.style.zIndex) || 0)));
            const nextIndex = (currentIndex + 1) % windows.length;
            
            windows.forEach(w => w.style.zIndex = 100);
            windows[nextIndex].style.zIndex = 1000;
            
            // Bring to front and focus
            windows[nextIndex].style.zIndex = ++zIndexCounter;
        }
    }
    
    closeActiveWindow() {
        const windows = Array.from(document.querySelectorAll('.window:not(.hidden)'));
        if (windows.length > 0) {
            const topWindow = windows.reduce((top, current) => {
                return (parseInt(current.style.zIndex) || 0) > (parseInt(top.style.zIndex) || 0) ? current : top;
            });
            
            if (topWindow) {
                const windowId = topWindow.id;
                closeWindow(windowId);
            }
        }
    }
    
    showDesktop() {
        document.querySelectorAll('.window').forEach(window => {
            window.classList.add('hidden');
        });
        updateTaskbar();
    }
    
    snapWindow(direction) {
        const windows = Array.from(document.querySelectorAll('.window:not(.hidden)'));
        if (windows.length > 0) {
            const topWindow = windows.reduce((top, current) => {
                return (parseInt(current.style.zIndex) || 0) > (parseInt(top.style.zIndex) || 0) ? current : top;
            });
            
            if (topWindow && window.snapper) {
                window.snapper.snapWindow(topWindow, direction);
            }
        }
    }
    
    lockScreen() {
        const lockScreen = document.createElement('div');
        lockScreen.id = 'lock-screen';
        lockScreen.innerHTML = `
            <div class="lock-screen-content">
                <div class="lock-screen-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div class="lock-screen-date">${new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'})}</div>
                <div class="lock-screen-unlock">
                    <div class="password-prompt">
                        <input type="password" placeholder="Enter password" id="lock-password">
                        <button onclick="unlockScreen()">Unlock</button>
                    </div>
                    <div class="lock-screen-hint">Press any key or click to unlock</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(lockScreen);
        
        // Auto focus password field
        setTimeout(() => {
            const passwordField = document.getElementById('lock-password');
            if (passwordField) passwordField.focus();
        }, 500);
        
        // Add click to unlock
        lockScreen.addEventListener('click', unlockScreen);
        
        // Add keyboard listener for unlock
        lockScreen.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                unlockScreen();
            }
        });
    }
    
    openRunDialog() {
        const runDialog = document.createElement('div');
        runDialog.className = 'run-dialog';
        runDialog.innerHTML = `
            <div class="run-dialog-content">
                <h3>Run Command</h3>
                <input type="text" id="run-command" placeholder="Enter app name or command">
                <div class="run-dialog-buttons">
                    <button onclick="executeRunCommand()">OK</button>
                    <button onclick="this.closest('.run-dialog').remove()">Cancel</button>
                </div>
                <div class="run-dialog-hint">
                    Try: files, browser, settings, terminal, calculator
                </div>
            </div>
        `;
        
        document.getElementById('window-area').appendChild(runDialog);
        
        // Focus input
        setTimeout(() => {
            document.getElementById('run-command').focus();
        }, 100);
    }
    
    showShortcutHint(shortcut) {
        const hint = document.createElement('div');
        hint.className = 'shortcut-hint';
        hint.textContent = shortcut;
        hint.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 122, 255, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: bold;
            z-index: 9999;
            animation: fadeInOut 1.5s ease;
        `;
        
        document.body.appendChild(hint);
        
        setTimeout(() => {
            hint.remove();
        }, 1500);
    }
}

// ===== COMMAND PALETTE =====
class CommandPalette {
    constructor() {
        this.commands = new Map();
        this.init();
    }
    
    init() {
        this.registerCommands();
        
        // Add Ctrl+Shift+P shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.show();
            }
        });
    }
    
    registerCommands() {
        // App commands
        this.commands.set('Open Files', { execute: () => launchApp('files'), category: 'Apps' });
        this.commands.set('Open Browser', { execute: () => launchApp('browser'), category: 'Apps' });
        this.commands.set('Open Settings', { execute: () => launchApp('settings'), category: 'Apps' });
        this.commands.set('Open Terminal', { execute: () => launchApp('terminal'), category: 'Apps' });
        
        // System commands
        this.commands.set('Show Desktop', { execute: () => new KeyboardShortcuts().showDesktop(), category: 'System' });
        this.commands.set('Lock Screen', { execute: () => new KeyboardShortcuts().lockScreen(), category: 'System' });
        this.commands.set('Task Manager', { execute: () => this.openTaskManager(), category: 'System' });
        
        // Window commands
        this.commands.set('Close Window', { execute: () => new KeyboardShortcuts().closeActiveWindow(), category: 'Windows' });
        this.commands.set('Maximize Window', { execute: () => this.maximizeActiveWindow(), category: 'Windows' });
        this.commands.set('Minimize All', { execute: () => document.querySelectorAll('.window').forEach(w => w.classList.add('hidden')), category: 'Windows' });
        
        // Theme commands
        this.commands.set('Dark Mode', { execute: () => this.setDarkMode(true), category: 'Appearance' });
        this.commands.set('Light Mode', { execute: () => this.setDarkMode(false), category: 'Appearance' });
        this.commands.set('Change Wallpaper', { execute: () => this.openWallpaperPicker(), category: 'Appearance' });
    }
    
    show() {
        const palette = document.createElement('div');
        palette.className = 'command-palette';
        palette.innerHTML = `
            <div class="command-palette-content">
                <input type="text" id="command-input" placeholder="Type a command...">
                <div class="command-list" id="command-list">
                    <!-- Commands will be listed here -->
                </div>
            </div>
        `;
        
        document.getElementById('window-area').appendChild(palette);
        
        // Focus input
        setTimeout(() => {
            const input = document.getElementById('command-input');
            input.focus();
            
            // Populate command list
            this.populateCommandList();
            
            // Add input event listener
            input.addEventListener('input', (e) => this.filterCommands(e.target.value));
            
            // Add keyboard navigation
            input.addEventListener('keydown', (e) => this.handlePaletteKeyDown(e, palette));
        }, 100);
    }
    
    populateCommandList(filter = '') {
        const commandList = document.getElementById('command-list');
        if (!commandList) return;
        
        commandList.innerHTML = '';
        
        // Group commands by category
        const categories = {};
        this.commands.forEach((cmd, name) => {
            if (!filter || name.toLowerCase().includes(filter.toLowerCase())) {
                if (!categories[cmd.category]) {
                    categories[cmd.category] = [];
                }
                categories[cmd.category].push({ name, execute: cmd.execute });
            }
        });
        
        // Render categories
        Object.keys(categories).forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'command-category';
            categoryDiv.innerHTML = `<h4>${category}</h4>`;
            
            categories[category].forEach(cmd => {
                const cmdDiv = document.createElement('div');
                cmdDiv.className = 'command-item';
                cmdDiv.textContent = cmd.name;
                cmdDiv.addEventListener('click', () => {
                    cmd.execute();
                    this.close();
                });
                categoryDiv.appendChild(cmdDiv);
            });
            
            commandList.appendChild(categoryDiv);
        });
    }
    
    filterCommands(query) {
        this.populateCommandList(query);
    }
    
    handlePaletteKeyDown(e, palette) {
        if (e.key === 'Escape') {
            this.close();
        } else if (e.key === 'Enter') {
            const selected = document.querySelector('.command-item.selected');
            if (selected) {
                const commandName = selected.textContent;
                const command = this.commands.get(commandName);
                if (command) {
                    command.execute();
                    this.close();
                }
            }
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const items = document.querySelectorAll('.command-item');
            const currentIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));
            
            let newIndex;
            if (e.key === 'ArrowDown') {
                newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            } else {
                newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            }
            
            items.forEach(item => item.classList.remove('selected'));
            if (items[newIndex]) {
                items[newIndex].classList.add('selected');
                items[newIndex].scrollIntoView({ block: 'nearest' });
            }
        }
    }
    
    close() {
        const palette = document.querySelector('.command-palette');
        if (palette) {
            palette.remove();
        }
    }
    
    openTaskManager() {
        const taskManager = document.createElement('div');
        taskManager.className = 'window';
        taskManager.style.width = '600px';
        taskManager.style.height = '400px';
        taskManager.style.top = '100px';
        taskManager.style.left = '100px';
        taskManager.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="fas fa-tasks"></i>
                    <span>Task Manager</span>
                </div>
                <div class="window-controls">
                    <button class="window-btn close-btn">×</button>
                </div>
            </div>
            <div class="window-content">
                <h3>Running Applications</h3>
                <div id="task-manager-list" style="margin-top: 20px;">
                    <!-- Running apps will be listed here -->
                </div>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="url-btn" id="end-task-btn">End Task</button>
                    <button class="url-btn" style="background: rgba(255,255,255,0.07);">Switch To</button>
                </div>
            </div>
        `;
        
        document.getElementById('window-area').appendChild(taskManager);
        
        // Populate running apps
        this.populateTaskManagerList(taskManager);
        
        // Add close button functionality
        taskManager.querySelector('.close-btn').addEventListener('click', () => {
            taskManager.remove();
        });
    }
    
    populateTaskManagerList(taskManager) {
        const list = taskManager.querySelector('#task-manager-list');
        list.innerHTML = '';
        
        const windows = Array.from(document.querySelectorAll('.window:not(.hidden)'));
        windows.forEach(win => {
            const appName = win.getAttribute('data-app');
            const displayName = getAppDisplayName(appName);
            
            const appDiv = document.createElement('div');
            appDiv.className = 'task-manager-item';
            appDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 8px;">
                    <i class="${getAppIcon(appName)}"></i>
                    <span style="flex: 1;">${displayName}</span>
                    <span class="app-status">Running</span>
                </div>
            `;
            
            list.appendChild(appDiv);
        });
    }
    
    maximizeActiveWindow() {
        const windows = Array.from(document.querySelectorAll('.window:not(.hidden)'));
        if (windows.length > 0) {
            const topWindow = windows.reduce((top, current) => {
                return (parseInt(current.style.zIndex) || 0) > (parseInt(top.style.zIndex) || 0) ? current : top;
            });
            
            if (topWindow) {
                const maxBtn = topWindow.querySelector('.max-btn');
                if (maxBtn) {
                    maxBtn.click();
                }
            }
        }
    }
    
    setDarkMode(enabled) {
        const toggle = document.getElementById('darkmode-toggle');
        if (toggle) {
            toggle.checked = enabled;
            toggle.dispatchEvent(new Event('change'));
        }
    }
    
    openWallpaperPicker() {
        const picker = document.createElement('div');
        picker.className = 'window';
        picker.style.width = '500px';
        picker.style.height = '400px';
        picker.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="fas fa-palette"></i>
                    <span>Wallpaper Picker</span>
                </div>
                <div class="window-controls">
                    <button class="window-btn close-btn">×</button>
                </div>
            </div>
            <div class="window-content">
                <h3>Choose a Wallpaper</h3>
                <div class="wallpaper-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;">
                    ${[1, 2, 3, 4].map(num => `
                        <div class="wallpaper-preview" data-wallpaper="${num}" 
                             style="background: linear-gradient(135deg, ${this.getWallpaperGradient(num)}); 
                                    height: 120px; border-radius: 8px; cursor: pointer; 
                                    display: flex; align-items: center; justify-content: center;">
                            <span style="color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">Wallpaper ${num}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 20px;">
                    <button class="url-btn" id="apply-wallpaper-btn">Apply Wallpaper</button>
                </div>
            </div>
        `;
        
        document.getElementById('window-area').appendChild(picker);
        
        // Add wallpaper selection
        let selectedWallpaper = 1;
        picker.querySelectorAll('.wallpaper-preview').forEach(preview => {
            preview.addEventListener('click', () => {
                picker.querySelectorAll('.wallpaper-preview').forEach(p => {
                    p.style.border = 'none';
                });
                preview.style.border = '3px solid #007aff';
                selectedWallpaper = preview.getAttribute('data-wallpaper');
            });
        });
        
        // Apply button
        picker.querySelector('#apply-wallpaper-btn').addEventListener('click', () => {
            changeWallpaper(selectedWallpaper);
            picker.querySelector('.close-btn').click();
        });
        
        // Close button
        picker.querySelector('.close-btn').addEventListener('click', () => {
            picker.remove();
        });
    }
    
    getWallpaperGradient(num) {
        const gradients = {
            1: '#0f2027, #203a43, #2c5364',
            2: '#1e3c72, #2a5298',
            3: '#42275a, #734b6d',
            4: '#141e30, #243b55'
        };
        return gradients[num] || gradients[1];
    }
}

// ===== NOTIFICATION SYSTEM =====
class NotificationSystem {
    constructor() {
        this.notificationQueue = [];
        this.isShowing = false;
        this.init();
    }
    
    init() {
        // Create notification container
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9998;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 350px;
        `;
        document.body.appendChild(container);
    }
    
    showNotification(title, message, options = {}) {
        const notification = {
            id: Date.now(),
            title,
            message,
            type: options.type || 'info',
            duration: options.duration || 5000,
            actions: options.actions || []
        };
        
        this.notificationQueue.push(notification);
        this.processQueue();
    }
    
    processQueue() {
        if (this.isShowing || this.notificationQueue.length === 0) return;
        
        this.isShowing = true;
        const notification = this.notificationQueue.shift();
        this.displayNotification(notification);
    }
    
    displayNotification(notification) {
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification-item notification-${notification.type}`;
        notificationEl.innerHTML = `
            <div class="notification-header">
                <i class="${this.getNotificationIcon(notification.type)}"></i>
                <span class="notification-title">${notification.title}</span>
                <button class="notification-close">&times;</button>
            </div>
            <div class="notification-body">${notification.message}</div>
            ${notification.actions.length > 0 ? `
                <div class="notification-actions">
                    ${notification.actions.map(action => `
                        <button class="notification-action" data-action="${action.action}">
                            ${action.label}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        document.getElementById('notification-container').appendChild(notificationEl);
        
        // Add close button functionality
        notificationEl.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notificationEl);
        });
        
        // Add action button functionality
        notificationEl.querySelectorAll('.notification-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.handleNotificationAction(action, notification);
                this.removeNotification(notificationEl);
            });
        });
        
        // Auto-remove after duration
        if (notification.duration > 0) {
            setTimeout(() => {
                this.removeNotification(notificationEl);
            }, notification.duration);
        }
    }
    
    removeNotification(notificationEl) {
        notificationEl.style.transform = 'translateX(100%)';
        notificationEl.style.opacity = '0';
        
        setTimeout(() => {
            if (notificationEl.parentNode) {
                notificationEl.parentNode.removeChild(notificationEl);
            }
            this.isShowing = false;
            this.processQueue();
        }, 300);
    }
    
    getNotificationIcon(type) {
        const icons = {
            'info': 'fas fa-info-circle',
            'success': 'fas fa-check-circle',
            'warning': 'fas fa-exclamation-triangle',
            'error': 'fas fa-times-circle'
        };
        return icons[type] || icons.info;
    }
    
    handleNotificationAction(action, notification) {
        switch (action) {
            case 'open_settings':
                launchApp('settings');
                break;
            case 'open_files':
                launchApp('files');
                break;
            case 'dismiss':
                // Do nothing
                break;
            default:
                console.log('Notification action:', action, notification);
        }
    }
}

// ===== SYSTEM MONITOR =====
class SystemMonitor {
    constructor() {
        this.metrics = {
            cpu: 0,
            memory: 0,
            windows: 0,
            uptime: 0
        };
        this.init();
    }
    
    init() {
        this.startMonitoring();
        this.addSystemTrayIndicator();
    }
    
    startMonitoring() {
        setInterval(() => {
            this.updateMetrics();
            this.updateTrayIndicator();
        }, 2000);
    }
    
    updateMetrics() {
        // Update CPU usage (simulated)
        this.metrics.cpu = Math.min(100, Math.max(0, 10 + Math.random() * 40));
        
        // Update memory usage
        this.metrics.memory = Math.min(100, Math.max(20, 30 + Math.random() * 50));
        
        // Count windows
        this.metrics.windows = document.querySelectorAll('.window:not(.hidden)').length;
        
        // Update uptime
        this.metrics.uptime = Math.floor((Date.now() - performance.timing.navigationStart) / 1000);
    }
    
    addSystemTrayIndicator() {
        // Add system monitor to taskbar
        const monitorIndicator = document.createElement('div');
        monitorIndicator.className = 'system-monitor-indicator';
        monitorIndicator.innerHTML = `
            <div class="monitor-display">
                <span class="cpu-indicator">CPU: <span id="cpu-value">0%</span></span>
                <span class="memory-indicator">RAM: <span id="memory-value">0%</span></span>
            </div>
        `;
        
        // Insert before clock
        const systemTray = document.querySelector('.system-tray');
        if (systemTray) {
            systemTray.insertBefore(monitorIndicator, systemTray.querySelector('.clock'));
        }
    }
    
    updateTrayIndicator() {
        const cpuElement = document.getElementById('cpu-value');
        const memoryElement = document.getElementById('memory-value');
        
        if (cpuElement) {
            cpuElement.textContent = `${Math.round(this.metrics.cpu)}%`;
            cpuElement.style.color = this.getUsageColor(this.metrics.cpu);
        }
        
        if (memoryElement) {
            memoryElement.textContent = `${Math.round(this.metrics.memory)}%`;
            memoryElement.style.color = this.getUsageColor(this.metrics.memory);
        }
    }
    
    getUsageColor(percentage) {
        if (percentage < 50) return '#4CAF50';
        if (percentage < 75) return '#FF9800';
        return '#F44336';
    }
    
    getSystemInfo() {
        return {
            ...this.metrics,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            browser: this.getBrowserInfo(),
            platform: navigator.platform
        };
    }
    
    getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }
}

// ===== GLOBAL FUNCTIONS =====
function unlockScreen() {
    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen) {
        lockScreen.remove();
        showNotification('Screen unlocked');
    }
}

function executeRunCommand() {
    const commandInput = document.getElementById('run-command');
    if (commandInput) {
        const command = commandInput.value.trim().toLowerCase();
        const runDialog = document.querySelector('.run-dialog');
        
        // Map commands to apps
        const commandMap = {
            'files': 'files',
            'browser': 'browser',
            'settings': 'settings',
            'terminal': 'terminal',
            'calculator': 'calculator',
            'notes': 'notes',
            'gallery': 'gallery',
            'music': 'music',
            'cmd': 'terminal',
            'explorer': 'files'
        };
        
        if (commandMap[command]) {
            launchApp(commandMap[command]);
        } else if (command) {
            showNotification(`Command "${command}" not found`);
        }
        
        if (runDialog) {
            runDialog.remove();
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize advanced features
    window.snapper = new WindowSnapper();
    window.desktopManager = new VirtualDesktopManager();
    window.keyboardShortcuts = new KeyboardShortcuts();
    window.commandPalette = new CommandPalette();
    window.notificationSystem = new NotificationSystem();
    window.systemMonitor = new SystemMonitor();
    
    console.log('Advanced Samsung DeX features loaded!');
    
    // Show welcome notification
    setTimeout(() => {
        window.notificationSystem.showNotification(
            'Advanced Features Enabled',
            'Multi-desktop, keyboard shortcuts, window snapping, and more are now available!',
            {
                type: 'success',
                actions: [
                    { label: 'Open Settings', action: 'open_settings' },
                    { label: 'Dismiss', action: 'dismiss' }
                ]
            }
        );
    }, 4000);
});

// Export for global access
window.advancedFeatures = {
    WindowSnapper,
    VirtualDesktopManager,
    KeyboardShortcuts,
    CommandPalette,
    NotificationSystem,
    SystemMonitor
}; 
/* ===== SAMSUNG DEX APPLICATIONS ===== */

// ===== FILE MANAGER =====
class FileManager {
    constructor(windowElement, appId) {
        this.window = windowElement;
        this.appId = appId;
        this.currentPath = '/';
        this.files = this.generateSampleFiles();
        this.init();
    }
    
    generateSampleFiles() {
        return {
            '/': {
                name: 'Internal storage',
                type: 'folder',
                items: [
                    { name: 'Documents', type: 'folder', size: '2.4 GB', modified: '2024-01-15' },
                    { name: 'Downloads', type: 'folder', size: '1.8 GB', modified: '2024-02-01' },
                    { name: 'Pictures', type: 'folder', size: '5.7 GB', modified: '2024-01-28' },
                    { name: 'Music', type: 'folder', size: '3.2 GB', modified: '2024-01-20' },
                    { name: 'Videos', type: 'folder', size: '8.9 GB', modified: '2024-01-25' },
                    { name: 'Android', type: 'folder', size: '4.1 GB', modified: '2024-02-01' }
                ]
            },
            '/Documents': {
                name: 'Documents',
                type: 'folder',
                items: [
                    { name: 'Work', type: 'folder', size: '1.2 GB', modified: '2024-01-30' },
                    { name: 'Personal', type: 'folder', size: '800 MB', modified: '2024-01-20' },
                    { name: 'Resume.pdf', type: 'pdf', size: '2.4 MB', modified: '2024-01-15' },
                    { name: 'Project_Plan.docx', type: 'doc', size: '5.7 MB', modified: '2024-01-28' },
                    { name: 'Budget.xlsx', type: 'xls', size: '3.2 MB', modified: '2024-01-25' }
                ]
            },
            '/Pictures': {
                name: 'Pictures',
                type: 'folder',
                items: [
                    { name: 'Screenshots', type: 'folder', size: '800 MB', modified: '2024-01-30' },
                    { name: 'Camera', type: 'folder', size: '4.2 GB', modified: '2024-01-28' },
                    { name: 'Wallpapers', type: 'folder', size: '700 MB', modified: '2024-01-20' },
                    { name: 'vacation_2023.jpg', type: 'image', size: '4.8 MB', modified: '2024-01-15' },
                    { name: 'family_photo.jpg', type: 'image', size: '3.2 MB', modified: '2024-01-10' }
                ]
            },
            '/Downloads': {
                name: 'Downloads',
                type: 'folder',
                items: [
                    { name: 'chrome_installer.exe', type: 'exe', size: '82 MB', modified: '2024-02-01' },
                    { name: 'document.zip', type: 'zip', size: '45 MB', modified: '2024-01-30' },
                    { name: 'movie_trailer.mp4', type: 'video', size: '120 MB', modified: '2024-01-28' },
                    { name: 'song_collection.mp3', type: 'audio', size: '85 MB', modified: '2024-01-25' }
                ]
            }
        };
    }
    
    init() {
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        const content = this.window.querySelector('.dex-window-content');
        content.innerHTML = `
            <div class="file-manager">
                <div class="file-manager-toolbar">
                    <div class="toolbar-left">
                        <button class="toolbar-btn" id="back-btn" title="Back">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <button class="toolbar-btn" id="forward-btn" title="Forward">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="toolbar-btn" id="up-btn" title="Up">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        
                        <div class="path-bar">
                            <span class="path-segment" data-path="/">Internal storage</span>
                            ${this.currentPath !== '/' ? this.currentPath.split('/').filter(p => p).map(segment => `
                                <i class="fas fa-chevron-right"></i>
                                <span class="path-segment" data-path="/${segment}">${segment}</span>
                            `).join('') : ''}
                        </div>
                    </div>
                    
                    <div class="toolbar-right">
                        <button class="toolbar-btn" id="new-folder-btn" title="New Folder">
                            <i class="fas fa-folder-plus"></i>
                        </button>
                        <button class="toolbar-btn" id="view-toggle" title="Change View">
                            <i class="fas fa-th-large"></i>
                        </button>
                        <button class="toolbar-btn" id="sort-btn" title="Sort">
                            <i class="fas fa-sort-amount-down"></i>
                        </button>
                        <button class="toolbar-btn" id="search-btn" title="Search">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                
                <div class="file-manager-sidebar">
                    <div class="sidebar-section">
                        <h3>Quick Access</h3>
                        <div class="sidebar-item active" data-path="/">
                            <i class="fas fa-home"></i>
                            <span>Home</span>
                        </div>
                        <div class="sidebar-item" data-path="/Downloads">
                            <i class="fas fa-download"></i>
                            <span>Downloads</span>
                        </div>
                        <div class="sidebar-item" data-path="/Documents">
                            <i class="fas fa-file"></i>
                            <span>Documents</span>
                        </div>
                        <div class="sidebar-item" data-path="/Pictures">
                            <i class="fas fa-image"></i>
                            <span>Pictures</span>
                        </div>
                        <div class="sidebar-item" data-path="/Music">
                            <i class="fas fa-music"></i>
                            <span>Music</span>
                        </div>
                        <div class="sidebar-item" data-path="/Videos">
                            <i class="fas fa-video"></i>
                            <span>Videos</span>
                        </div>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3>Devices</h3>
                        <div class="sidebar-item">
                            <i class="fas fa-hdd"></i>
                            <span>Internal Storage (128 GB)</span>
                            <span class="storage-info">45 GB free</span>
                        </div>
                        <div class="sidebar-item">
                            <i class="fas fa-sd-card"></i>
                            <span>SD Card (256 GB)</span>
                            <span class="storage-info">189 GB free</span>
                        </div>
                        <div class="sidebar-item">
                            <i class="fas fa-cloud"></i>
                            <span>Samsung Cloud (15 GB)</span>
                            <span class="storage-info">8 GB free</span>
                        </div>
                    </div>
                </div>
                
                <div class="file-manager-content">
                    <div class="file-grid" id="file-grid">
                        <!-- Files will be rendered here -->
                    </div>
                    
                    <div class="file-info-bar">
                        <span id="selected-count">0 items selected</span>
                        <span id="storage-info">45 GB free of 128 GB</span>
                    </div>
                </div>
            </div>
        `;
        
        this.renderFiles();
    }
    
    renderFiles() {
        const fileGrid = this.window.querySelector('#file-grid');
        const currentFolder = this.files[this.currentPath];
        
        if (!currentFolder) {
            fileGrid.innerHTML = '<div class="empty-folder">Folder is empty</div>';
            return;
        }
        
        fileGrid.innerHTML = currentFolder.items.map(item => `
            <div class="file-item" data-name="${item.name}" data-type="${item.type}">
                <div class="file-icon">
                    ${this.getFileIcon(item.type)}
                </div>
                <div class="file-name" title="${item.name}">${item.name}</div>
                <div class="file-size">${item.size}</div>
                <div class="file-modified">${item.modified}</div>
            </div>
        `).join('');
    }
    
    getFileIcon(type) {
        const icons = {
            'folder': '<i class="fas fa-folder"></i>',
            'pdf': '<i class="fas fa-file-pdf"></i>',
            'doc': '<i class="fas fa-file-word"></i>',
            'xls': '<i class="fas fa-file-excel"></i>',
            'image': '<i class="fas fa-file-image"></i>',
            'video': '<i class="fas fa-file-video"></i>',
            'audio': '<i class="fas fa-file-audio"></i>',
            'zip': '<i class="fas fa-file-archive"></i>',
            'exe': '<i class="fas fa-cog"></i>'
        };
        
        return icons[type] || '<i class="fas fa-file"></i>';
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.window.querySelector('#back-btn').addEventListener('click', () => {
            this.navigateBack();
        });
        
        this.window.querySelector('#up-btn').addEventListener('click', () => {
            this.navigateUp();
        });
        
        // Sidebar navigation
        this.window.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                const path = item.getAttribute('data-path');
                this.navigateTo(path);
            });
        });
        
        // File items
        this.window.addEventListener('click', (e) => {
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                const type = fileItem.getAttribute('data-type');
                const name = fileItem.getAttribute('data-name');
                
                if (type === 'folder') {
                    this.navigateTo(`${this.currentPath}${this.currentPath === '/' ? '' : '/'}${name}`);
                } else {
                    this.openFile(name, type);
                }
            }
        });
        
        // New folder button
        this.window.querySelector('#new-folder-btn').addEventListener('click', () => {
            this.createNewFolder();
        });
        
        // Path segments
        this.window.querySelectorAll('.path-segment').forEach(segment => {
            segment.addEventListener('click', () => {
                const path = segment.getAttribute('data-path');
                this.navigateTo(path);
            });
        });
    }
    
    navigateTo(path) {
        if (this.files[path]) {
            this.currentPath = path;
            
            // Update active state in sidebar
            this.window.querySelectorAll('.sidebar-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-path') === path) {
                    item.classList.add('active');
                }
            });
            
            // Update path bar
            this.render();
        }
    }
    
    navigateBack() {
        if (this.currentPath !== '/') {
            const parts = this.currentPath.split('/').filter(p => p);
            parts.pop();
            const newPath = parts.length ? '/' + parts.join('/') : '/';
            this.navigateTo(newPath);
        }
    }
    
    navigateUp() {
        this.navigateBack();
    }
    
    openFile(name, type) {
        let message = '';
        let icon = '';
        
        switch(type) {
            case 'pdf':
                message = `Opening PDF: ${name}`;
                icon = 'fas fa-file-pdf';
                break;
            case 'doc':
                message = `Opening document: ${name}`;
                icon = 'fas fa-file-word';
                break;
            case 'image':
                message = `Opening image: ${name}`;
                icon = 'fas fa-image';
                break;
            case 'video':
                message = `Playing video: ${name}`;
                icon = 'fas fa-play';
                break;
            default:
                message = `Opening file: ${name}`;
                icon = 'fas fa-file';
        }
        
        window.dex.showNotification({
            title: 'File Manager',
            message: message,
            icon: icon,
            type: 'info'
        });
    }
    
    createNewFolder() {
        const folderName = prompt('Enter new folder name:', 'New Folder');
        if (folderName && folderName.trim()) {
            const currentFolder = this.files[this.currentPath];
            if (currentFolder) {
                currentFolder.items.unshift({
                    name: folderName.trim(),
                    type: 'folder',
                    size: '0 B',
                    modified: new Date().toISOString().split('T')[0]
                });
                
                this.renderFiles();
                
                window.dex.showNotification({
                    title: 'Folder Created',
                    message: `"${folderName}" has been created`,
                    icon: 'fas fa-folder-plus',
                    type: 'success'
                });
            }
        }
    }
    
    cleanup() {
        // Cleanup code if needed
    }
}

// ===== GALLERY APP =====
class GalleryApp {
    constructor(windowElement, appId) {
        this.window = windowElement;
        this.appId = appId;
        this.images = this.generateSampleImages();
        this.currentAlbum = 'all';
        this.init();
    }
    
    generateSampleImages() {
        return {
            'all': [
                { id: 1, name: 'Mountain View.jpg', date: '2024-01-15', size: '4.8 MB', favorite: true },
                { id: 2, name: 'Beach Sunset.jpg', date: '2024-01-10', size: '3.2 MB', favorite: true },
                { id: 3, name: 'City Night.jpg', date: '2024-01-28', size: '5.1 MB', favorite: false },
                { id: 4, name: 'Forest Path.jpg', date: '2024-01-20', size: '2.8 MB', favorite: false },
                { id: 5, name: 'Lake Reflection.jpg', date: '2024-01-25', size: '4.2 MB', favorite: true },
                { id: 6, name: 'Desert Dunes.jpg', date: '2024-01-30', size: '3.9 MB', favorite: false },
                { id: 7, name: 'Winter Snow.jpg', date: '2024-02-01', size: '4.5 MB', favorite: true },
                { id: 8, name: 'Autumn Leaves.jpg', date: '2024-01-18', size: '3.7 MB', favorite: false }
            ],
            'favorites': [
                { id: 1, name: 'Mountain View.jpg', date: '2024-01-15', size: '4.8 MB', favorite: true },
                { id: 2, name: 'Beach Sunset.jpg', date: '2024-01-10', size: '3.2 MB', favorite: true },
                { id: 5, name: 'Lake Reflection.jpg', date: '2024-01-25', size: '4.2 MB', favorite: true },
                { id: 7, name: 'Winter Snow.jpg', date: '2024-02-01', size: '4.5 MB', favorite: true }
            ],
            'recent': [
                { id: 7, name: 'Winter Snow.jpg', date: '2024-02-01', size: '4.5 MB', favorite: true },
                { id: 6, name: 'Desert Dunes.jpg', date: '2024-01-30', size: '3.9 MB', favorite: false },
                { id: 5, name: 'Lake Reflection.jpg', date: '2024-01-25', size: '4.2 MB', favorite: true },
                { id: 4, name: 'Forest Path.jpg', date: '2024-01-20', size: '2.8 MB', favorite: false }
            ]
        };
    }
    
    init() {
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        const content = this.window.querySelector('.dex-window-content');
        content.innerHTML = `
            <div class="gallery-app">
                <div class="gallery-toolbar">
                    <div class="toolbar-left">
                        <button class="toolbar-btn" id="gallery-back">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <h2>Gallery</h2>
                    </div>
                    
                    <div class="toolbar-right">
                        <button class="toolbar-btn" id="select-mode">
                            <i class="fas fa-check-square"></i>
                            <span>Select</span>
                        </button>
                        <button class="toolbar-btn" id="slideshow">
                            <i class="fas fa-play"></i>
                            <span>Slideshow</span>
                        </button>
                        <button class="toolbar-btn" id="share">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="toolbar-btn" id="more-options">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                </div>
                
                <div class="gallery-container">
                    <div class="gallery-sidebar">
                        <div class="sidebar-item ${this.currentAlbum === 'all' ? 'active' : ''}" data-album="all">
                            <i class="fas fa-images"></i>
                            <span>All photos</span>
                            <span class="count">${this.images.all.length}</span>
                        </div>
                        <div class="sidebar-item ${this.currentAlbum === 'favorites' ? 'active' : ''}" data-album="favorites">
                            <i class="fas fa-heart"></i>
                            <span>Favorites</span>
                            <span class="count">${this.images.favorites.length}</span>
                        </div>
                        <div class="sidebar-item ${this.currentAlbum === 'recent' ? 'active' : ''}" data-album="recent">
                            <i class="fas fa-clock"></i>
                            <span>Recent</span>
                            <span class="count">${this.images.recent.length}</span>
                        </div>
                        
                        <div class="sidebar-section">
                            <h3>Albums</h3>
                            <div class="sidebar-item" data-album="vacation">
                                <i class="fas fa-umbrella-beach"></i>
                                <span>Vacation 2023</span>
                                <span class="count">24</span>
                            </div>
                            <div class="sidebar-item" data-album="family">
                                <i class="fas fa-users"></i>
                                <span>Family</span>
                                <span class="count">18</span>
                            </div>
                            <div class="sidebar-item" data-album="friends">
                                <i class="fas fa-user-friends"></i>
                                <span>Friends</span>
                                <span class="count">32</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="gallery-content">
                        <div class="image-grid" id="image-grid">
                            <!-- Images will be rendered here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.renderImages();
    }
    
    renderImages() {
        const imageGrid = this.window.querySelector('#image-grid');
        const currentImages = this.images[this.currentAlbum] || [];
        
        imageGrid.innerHTML = currentImages.map(image => `
            <div class="image-item" data-id="${image.id}">
                <div class="image-thumbnail" style="background: linear-gradient(135deg, ${this.getRandomColor()}, ${this.getRandomColor()});">
                    <div class="image-overlay">
                        ${image.favorite ? '<i class="fas fa-heart favorite"></i>' : ''}
                        <button class="image-btn favorite-btn" title="Add to favorites">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="image-btn share-btn" title="Share">
                            <i class="fas fa-share"></i>
                        </button>
                    </div>
                </div>
                <div class="image-info">
                    <div class="image-name">${image.name}</div>
                    <div class="image-details">
                        <span>${image.date}</span>
                        <span>•</span>
                        <span>${image.size}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    getRandomColor() {
        const colors = [
            '#4285f4', '#34a853', '#fbbc05', '#ea4335',
            '#8e44ad', '#2ecc71', '#e74c3c', '#3498db',
            '#1abc9c', '#d35400', '#9b59b6', '#34495e'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    setupEventListeners() {
        // Album navigation
        this.window.querySelectorAll('.sidebar-item[data-album]').forEach(item => {
            item.addEventListener('click', () => {
                const album = item.getAttribute('data-album');
                this.switchAlbum(album);
            });
        });
        
        // Image actions
        this.window.addEventListener('click', (e) => {
            const favoriteBtn = e.target.closest('.favorite-btn');
            const shareBtn = e.target.closest('.share-btn');
            const imageItem = e.target.closest('.image-item');
            
            if (favoriteBtn) {
                e.stopPropagation();
                const imageId = parseInt(imageItem.getAttribute('data-id'));
                this.toggleFavorite(imageId);
            } else if (shareBtn) {
                e.stopPropagation();
                window.dex.showNotification({
                    title: 'Share',
                    message: 'Sharing image...',
                    icon: 'fas fa-share',
                    type: 'info'
                });
            } else if (imageItem) {
                this.viewImage(imageItem.getAttribute('data-id'));
            }
        });
        
        // Toolbar buttons
        this.window.querySelector('#slideshow').addEventListener('click', () => {
            this.startSlideshow();
        });
        
        this.window.querySelector('#select-mode').addEventListener('click', () => {
            this.toggleSelectMode();
        });
    }
    
    switchAlbum(album) {
        this.currentAlbum = album;
        
        // Update active state
        this.window.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-album') === album) {
                item.classList.add('active');
            }
        });
        
        this.renderImages();
    }
    
    toggleFavorite(imageId) {
        const image = this.images.all.find(img => img.id === imageId);
        if (image) {
            image.favorite = !image.favorite;
            
            // Update favorites list
            if (image.favorite) {
                if (!this.images.favorites.find(img => img.id === imageId)) {
                    this.images.favorites.push({...image});
                }
            } else {
                this.images.favorites = this.images.favorites.filter(img => img.id !== imageId);
            }
            
            // Re-render current view
            this.renderImages();
            
            window.dex.showNotification({
                title: image.favorite ? 'Added to Favorites' : 'Removed from Favorites',
                message: image.name,
                icon: 'fas fa-heart',
                type: 'success'
            });
        }
    }
    
    viewImage(imageId) {
        const image = this.images.all.find(img => img.id === imageId);
        if (image) {
            window.dex.showNotification({
                title: 'Viewing Image',
                message: image.name,
                icon: 'fas fa-image',
                type: 'info'
            });
        }
    }
    
    startSlideshow() {
        window.dex.showNotification({
            title: 'Slideshow Started',
            message: 'Enjoy your photos!',
            icon: 'fas fa-play',
            type: 'success'
        });
    }
    
    toggleSelectMode() {
        window.dex.showNotification({
            title: 'Select Mode',
            message: 'Select multiple images',
            icon: 'fas fa-check-square',
            type: 'info'
        });
    }
    
    cleanup() {
        // Cleanup code
    }
}

// ===== BROWSER APP =====
class BrowserApp {
    constructor(windowElement, appId) {
        this.window = windowElement;
        this.appId = appId;
        this.currentUrl = 'https://www.samsung.com';
        this.history = [];
        this.bookmarks = [
            { name: 'Samsung', url: 'https://www.samsung.com' },
            { name: 'Google', url: 'https://www.google.com' },
            { name: 'YouTube', url: 'https://www.youtube.com' },
            { name: 'GitHub', url: 'https://www.github.com' }
        ];
        this.init();
    }
    
    init() {
        this.render();
        this.setupEventListeners();
        this.loadPage(this.currentUrl);
    }
    
    render() {
        const content = this.window.querySelector('.dex-window-content');
        content.innerHTML = `
            <div class="browser-app">
                <div class="browser-toolbar">
                    <div class="toolbar-left">
                        <button class="toolbar-btn" id="browser-back" title="Back">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <button class="toolbar-btn" id="browser-forward" title="Forward">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="toolbar-btn" id="browser-refresh" title="Refresh">
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                    
                    <div class="url-bar">
                        <input type="text" id="url-input" value="${this.currentUrl}" 
                               placeholder="Search or enter website address">
                        <button class="url-btn" id="go-btn">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                    
                    <div class="toolbar-right">
                        <button class="toolbar-btn" id="browser-bookmarks" title="Bookmarks">
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button class="toolbar-btn" id="browser-tabs" title="Tabs">
                            <i class="fas fa-window-restore"></i>
                        </button>
                        <button class="toolbar-btn" id="browser-menu" title="Menu">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                </div>
                
                <div class="browser-content" id="browser-content">
                    <!-- Page content will be loaded here -->
                </div>
                
                <div class="browser-tabs">
                    <div class="tab active" data-url="${this.currentUrl}">
                        <span>Samsung</span>
                        <button class="tab-close">&times;</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    loadPage(url) {
        const content = this.window.querySelector('#browser-content');
        
        // Add to history
        this.history.push({
            url: url,
            title: this.getDomainFromUrl(url),
            timestamp: new Date().toISOString()
        });
        
        // Update URL bar
        this.window.querySelector('#url-input').value = url;
        
        // Simulate page loading
        content.innerHTML = `
            <div class="page-loading">
                <div class="loading-spinner">
                    <i class="fas fa-circle-notch fa-spin"></i>
                </div>
                <div class="loading-text">Loading ${this.getDomainFromUrl(url)}...</div>
            </div>
        `;
        
        // Simulate network delay
        setTimeout(() => {
            this.showPageContent(url);
        }, 1000);
    }
    
    showPageContent(url) {
        const content = this.window.querySelector('#browser-content');
        const domain = this.getDomainFromUrl(url);
        
        let pageContent = '';
        
        if (url.includes('samsung.com')) {
            pageContent = `
                <div class="webpage samsung-page">
                    <div class="page-header">
                        <h1>Samsung</h1>
                        <p>Welcome to the official Samsung website</p>
                    </div>
                    <div class="page-content">
                        <div class="product-grid">
                            <div class="product-card">
                                <div class="product-image" style="background: linear-gradient(135deg, #4285f4, #34a853);"></div>
                                <div class="product-info">
                                    <h3>Galaxy S24</h3>
                                    <p>Experience the future of smartphones</p>
                                </div>
                            </div>
                            <div class="product-card">
                                <div class="product-image" style="background: linear-gradient(135deg, #fbbc05, #ea4335);"></div>
                                <div class="product-info">
                                    <h3>Galaxy Tab S9</h3>
                                    <p>Premium tablet experience</p>
                                </div>
                            </div>
                            <div class="product-card">
                                <div class="product-image" style="background: linear-gradient(135deg, #8e44ad, #3498db);"></div>
                                <div class="product-info">
                                    <h3>Galaxy Watch 6</h3>
                                    <p>Advanced health monitoring</p>
                                </div>
                            </div>
                        </div>
                        <div class="page-section">
                            <h2>About Samsung DeX</h2>
                            <p>Transform your smartphone into a desktop experience with Samsung DeX. Connect to a monitor, keyboard, and mouse for a full desktop experience.</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (url.includes('google.com')) {
            pageContent = `
                <div class="webpage google-page">
                    <div class="google-logo">Google</div>
                    <div class="search-box">
                        <input type="text" placeholder="Search Google or type a URL">
                        <button><i class="fas fa-search"></i></button>
                    </div>
                </div>
            `;
        } else {
            pageContent = `
                <div class="webpage generic-page">
                    <div class="page-header">
                        <h1>${domain}</h1>
                    </div>
                    <div class="page-content">
                        <p>This is a simulated webpage for ${domain}.</p>
                        <p>In a real browser, you would see the actual website content here.</p>
                    </div>
                </div>
            `;
        }
        
        content.innerHTML = pageContent;
        
        window.dex.showNotification({
            title: 'Page Loaded',
            message: `Loaded ${domain}`,
            icon: 'fas fa-check-circle',
            type: 'success'
        });
    }
    
    getDomainFromUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return url;
        }
    }
    
    setupEventListeners() {
        // URL bar
        const urlInput = this.window.querySelector('#url-input');
        const goBtn = this.window.querySelector('#go-btn');
        
        const navigate = () => {
            let url = urlInput.value.trim();
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            }
            this.loadPage(url);
        };
        
        goBtn.addEventListener('click', navigate);
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') navigate();
        });
        
        // Navigation buttons
        this.window.querySelector('#browser-back').addEventListener('click', () => {
            if (this.history.length > 1) {
                this.history.pop(); // Remove current
                const previous = this.history[this.history.length - 1];
                if (previous) {
                    this.loadPage(previous.url);
                }
            }
        });
        
        this.window.querySelector('#browser-refresh').addEventListener('click', () => {
            this.loadPage(this.currentUrl);
        });
        
        // Bookmarks
        this.window.querySelector('#browser-bookmarks').addEventListener('click', () => {
            this.showBookmarks();
        });
        
        // Tabs
        this.window.querySelector('#browser-tabs').addEventListener('click', () => {
            this.showTabs();
        });
    }
    
    showBookmarks() {
        const bookmarksList = this.bookmarks.map(bookmark => `
            <div class="bookmark-item" data-url="${bookmark.url}">
                <i class="fas fa-bookmark"></i>
                <span>${bookmark.name}</span>
                <span class="bookmark-url">${bookmark.url}</span>
            </div>
        `).join('');
        
        window.dex.showNotification({
            title: 'Bookmarks',
            message: 'Available bookmarks',
            icon: 'fas fa-bookmark',
            type: 'info',
            duration: 3000
        });
    }
    
    showTabs() {
        window.dex.showNotification({
            title: 'Tabs',
            message: 'Tab management',
            icon: 'fas fa-window-restore',
            type: 'info'
        });
    }
    
    cleanup() {
        // Cleanup code
    }
}

// ===== EMAIL APP =====
class EmailApp {
    constructor(windowElement, appId) {
        this.window = windowElement;
        this.appId = appId;
        this.emails = this.generateSampleEmails();
        this.currentFolder = 'inbox';
        this.init();
    }
    
    generateSampleEmails() {
        return {
            'inbox': [
                {
                    id: 1,
                    from: 'Samsung News',
                    subject: 'Introducing Galaxy S24',
                    preview: 'Experience the future of smartphones with our latest flagship device...',
                    time: '10:30 AM',
                    unread: true,
                    starred: true
                },
                {
                    id: 2,
                    from: 'Google',
                    subject: 'Security Alert',
                    preview: 'New sign-in detected on your Google account...',
                    time: 'Yesterday',
                    unread: true,
                    starred: false
                },
                {
                    id: 3,
                    from: 'GitHub',
                    subject: 'Repository Activity',
                    preview: 'Your repository has 3 new commits...',
                    time: 'Feb 1',
                    unread: false,
                    starred: true
                },
                {
                    id: 4,
                    from: 'Netflix',
                    subject: 'New Shows Added',
                    preview: 'Check out the latest additions to our library...',
                    time: 'Jan 30',
                    unread: false,
                    starred: false
                }
            ],
            'sent': [
                {
                    id: 5,
                    to: 'John Doe',
                    subject: 'Project Update',
                    preview: 'Here is the latest update on our project...',
                    time: 'Jan 28',
                    unread: false,
                    starred: false
                }
            ],
            'drafts': [
                {
                    id: 6,
                    subject: 'Meeting Notes',
                    preview: 'Here are the notes from our last team meeting...',
                    time: 'Jan 25',
                    unread: false,
                    starred: false
                }
            ]
        };
    }
    
    init() {
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        const content = this.window.querySelector('.dex-window-content');
        content.innerHTML = `
            <div class="email-app">
                <div class="email-toolbar">
                    <button class="toolbar-btn" id="compose-email">
                        <i class="fas fa-edit"></i>
                        <span>Compose</span>
                    </button>
                    
                    <div class="toolbar-right">
                        <button class="toolbar-btn" id="email-search">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="toolbar-btn" id="email-refresh">
                            <i class="fas fa-redo"></i>
                        </button>
                        <button class="toolbar-btn" id="email-menu">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                </div>
                
                <div class="email-container">
                    <div class="email-sidebar">
                        <div class="sidebar-item ${this.currentFolder === 'inbox' ? 'active' : ''}" data-folder="inbox">
                            <i class="fas fa-inbox"></i>
                            <span>Inbox</span>
                            <span class="badge">${this.emails.inbox.filter(e => e.unread).length}</span>
                        </div>
                        <div class="sidebar-item ${this.currentFolder === 'starred' ? 'active' : ''}" data-folder="starred">
                            <i class="fas fa-star"></i>
                            <span>Starred</span>
                        </div>
                        <div class="sidebar-item ${this.currentFolder === 'sent' ? 'active' : ''}" data-folder="sent">
                            <i class="fas fa-paper-plane"></i>
                            <span>Sent</span>
                        </div>
                        <div class="sidebar-item ${this.currentFolder === 'drafts' ? 'active' : ''}" data-folder="drafts">
                            <i class="fas fa-file"></i>
                            <span>Drafts</span>
                            <span class="badge">${this.emails.drafts.length}</span>
                        </div>
                    </div>
                    
                    <div class="email-content">
                        <div class="email-list" id="email-list">
                            <!-- Emails will be rendered here -->
                        </div>
                        
                        <div class="email-view" id="email-view">
                            <div class="empty-email-view">
                                <i class="fas fa-envelope-open"></i>
                                <p>Select an email to read</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.renderEmails();
    }
    
    renderEmails() {
        const emailList = this.window.querySelector('#email-list');
        const currentEmails = this.emails[this.currentFolder] || [];
        
        emailList.innerHTML = currentEmails.map(email => `
            <div class="email-item ${email.unread ? 'unread' : ''}" data-id="${email.id}">
                <div class="email-select">
                    <input type="checkbox">
                </div>
                <div class="email-star">
                    <button class="star-btn ${email.starred ? 'starred' : ''}">
                        <i class="${email.starred ? 'fas' : 'far'} fa-star"></i>
                    </button>
                </div>
                <div class="email-from">
                    ${this.currentFolder === 'sent' ? email.to : email.from}
                </div>
                <div class="email-content">
                    <div class="email-subject">
                        ${email.subject}
                        ${email.unread ? '<span class="unread-dot"></span>' : ''}
                    </div>
                    <div class="email-preview">${email.preview}</div>
                </div>
                <div class="email-time">${email.time}</div>
            </div>
        `).join('');
    }
    
    setupEventListeners() {
        // Folder navigation
        this.window.querySelectorAll('.sidebar-item[data-folder]').forEach(item => {
            item.addEventListener('click', () => {
                const folder = item.getAttribute('data-folder');
                this.switchFolder(folder);
            });
        });
        
        // Email items
        this.window.addEventListener('click', (e) => {
            const emailItem = e.target.closest('.email-item');
            const starBtn = e.target.closest('.star-btn');
            
            if (emailItem && !starBtn) {
                const emailId = parseInt(emailItem.getAttribute('data-id'));
                this.viewEmail(emailId);
            } else if (starBtn) {
                e.stopPropagation();
                const emailItem = starBtn.closest('.email-item');
                const emailId = parseInt(emailItem.getAttribute('data-id'));
                this.toggleStar(emailId);
            }
        });
        
        // Compose button
        this.window.querySelector('#compose-email').addEventListener('click', () => {
            this.composeEmail();
        });
    }
    
    switchFolder(folder) {
        this.currentFolder = folder;
        
        // Update active state
        this.window.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-folder') === folder) {
                item.classList.add('active');
            }
        });
        
        this.renderEmails();
    }
    
    viewEmail(emailId) {
        const email = this.findEmailById(emailId);
        if (!email) return;
        
        // Mark as read
        email.unread = false;
        
        const emailView = this.window.querySelector('#email-view');
        emailView.innerHTML = `
            <div class="email-detail">
                <div class="email-header">
                    <div class="email-subject-large">${email.subject}</div>
                    <div class="email-from-large">
                        ${this.currentFolder === 'sent' ? 'To: ' + email.to : 'From: ' + email.from}
                    </div>
                    <div class="email-time-large">${email.time}</div>
                </div>
                
                <div class="email-body">
                    <p>Dear User,</p>
                    <p>${email.pview}</p>
                    <p>This is a simulated email body for demonstration purposes.</p>
                    <p>Best regards,<br>${this.currentFolder === 'sent' ? 'You' : email.from}</p>
                </div>
                
                <div class="email-actions">
                    <button class="email-action-btn">
                        <i class="fas fa-reply"></i>
                        <span>Reply</span>
                    </button>
                    <button class="email-action-btn">
                        <i class="fas fa-reply-all"></i>
                        <span>Reply All</span>
                    </button>
                    <button class="email-action-btn">
                        <i class="fas fa-share"></i>
                        <span>Forward</span>
                    </button>
                </div>
            </div>
        `;
        
        // Re-render emails to update unread status
        this.renderEmails();
    }
    
    toggleStar(emailId) {
        const email = this.findEmailById(emailId);
        if (email) {
            email.starred = !email.starred;
            this.renderEmails();
        }
    }
    
    findEmailById(id) {
        for (const folder in this.emails) {
            const email = this.emails[folder].find(e => e.id === id);
            if (email) return email;
        }
        return null;
    }
    
    composeEmail() {
        const emailView = this.window.querySelector('#email-view');
        emailView.innerHTML = `
            <div class="compose-email">
                <div class="compose-header">
                    <h3>New Message</h3>
                </div>
                <div class="compose-form">
                    <div class="form-field">
                        <input type="text" placeholder="To">
                    </div>
                    <div class="form-field">
                        <input type="text" placeholder="Subject">
                    </div>
                    <div class="form-field">
                        <textarea placeholder="Type your message here..." rows="10"></textarea>
                    </div>
                </div>
                <div class="compose-actions">
                    <button class="compose-btn send-btn">
                        <i class="fas fa-paper-plane"></i>
                        <span>Send</span>
                    </button>
                    <button class="compose-btn discard-btn">
                        <i class="fas fa-trash"></i>
                        <span>Discard</span>
                    </button>
                </div>
            </div>
        `;
        
        // Send button
        emailView.querySelector('.send-btn').addEventListener('click', () => {
            window.dex.showNotification({
                title: 'Email Sent',
                message: 'Your email has been sent successfully',
                icon: 'fas fa-check-circle',
                type: 'success'
            });
            
            // Clear compose view
            emailView.innerHTML = `
                <div class="empty-email-view">
                    <i class="fas fa-envelope-open"></i>
                    <p>Select an email to read</p>
                </div>
            `;
        });
        
        // Discard button
        emailView.querySelector('.discard-btn').addEventListener('click', () => {
            emailView.innerHTML = `
                <div class="empty-email-view">
                    <i class="fas fa-envelope-open"></i>
                    <p>Select an email to read</p>
                </div>
            `;
        });
    }
    
    cleanup() {
        // Cleanup code
    }
}

// ===== SETTINGS APP =====
class SettingsApp {
    constructor(windowElement, appId) {
        this.window = windowElement;
        this.appId = appId;
        this.init();
    }
    
    init() {
        this.render();
        this.setupEventListeners();
    }
    
    render() {
        const content = this.window.querySelector('.dex-window-content');
        content.innerHTML = `
            <div class="settings-app">
                <div class="settings-sidebar">
                    <div class="sidebar-item active" data-section="display">
                        <i class="fas fa-desktop"></i>
                        <span>Display</span>
                    </div>
                    <div class="sidebar-item" data-section="sound">
                        <i class="fas fa-volume-up"></i>
                        <span>Sound</span>
                    </div>
                    <div class="sidebar-item" data-section="network">
                        <i class="fas fa-wifi"></i>
                        <span>Network</span>
                    </div>
                    <div class="sidebar-item" data-section="apps">
                        <i class="fas fa-th"></i>
                        <span>Apps</span>
                    </div>
                    <div class="sidebar-item" data-section="storage">
                        <i class="fas fa-hdd"></i>
                        <span>Storage</span>
                    </div>
                    <div class="sidebar-item" data-section="system">
                        <i class="fas fa-cog"></i>
                        <span>System</span>
                    </div>
                    <div class="sidebar-item" data-section="about">
                        <i class="fas fa-info-circle"></i>
                        <span>About DeX</span>
                    </div>
                </div>
                
                <div class="settings-content">
                    <div class="settings-section active" id="display-settings">
                        <h2>Display Settings</h2>
                        <div class="settings-group">
                            <div class="setting-item">
                                <label>Screen Resolution</label>
                                <select>
                                    <option>1920x1080 (Recommended)</option>
                                    <option>1600x900</option>
                                    <option>1366x768</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>Refresh Rate</label>
                                <select>
                                    <option>60Hz</option>
                                    <option>120Hz</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>Night Light</label>
                                <label class="dex-switch">
                                    <input type="checkbox">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-section" id="sound-settings">
                        <h2>Sound Settings</h2>
                        <!-- Sound settings content -->
                    </div>
                    
                    <div class="settings-section" id="about-settings">
                        <h2>About Samsung DeX</h2>
                        <div class="about-info">
                            <div class="info-item">
                                <label>Version:</label>
                                <span>DeX 4.0</span>
                            </div>
                            <div class="info-item">
                                <label>Build Number:</label>
                                <span>R16NW.G955FXXU4CRGB</span>
                            </div>
                            <div class="info-item">
                                <label>Model:</label>
                                <span>Samsung DeX Web Simulator</span>
                            </div>
                            <div class="info-item">
                                <label>Uptime:</label>
                                <span id="settings-uptime">00:00:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Sidebar navigation
        this.window.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                this.switchSection(section);
            });
        });
        
        // Update uptime
        setInterval(() => {
            const uptimeElement = this.window.querySelector('#settings-uptime');
            if (uptimeElement && window.dex) {
                uptimeElement.textContent = window.dex.formatUptime(window.dex.system.uptime);
            }
        }, 1000);
    }
    
    switchSection(section) {
        // Update sidebar active state
        this.window.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === section) {
                item.classList.add('active');
            }
        });
        
        // Show selected section
        this.window.querySelectorAll('.settings-section').forEach(sect => {
            sect.classList.remove('active');
        });
        
        const targetSection = this.window.querySelector(`#${section}-settings`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
    
    cleanup() {
        // Cleanup code
    }
}

// ===== ADDITIONAL APPS (Placeholders) =====
class CalculatorApp {
    constructor(windowElement, appId) {
        this.window = windowElement;
        this.appId = appId;
        this.init();
    }
    
    init() {
        this.render();
    }
    
    render() {
        const content = this.window.querySelector('.dex-window-content');
        content.innerHTML = '<h2>Calculator App - Coming Soon</h2>';
    }
    
    cleanup() {}
}

class CalendarApp {
    constructor(windowElement, appId) {
        this.window = windowElement;
        this.appId = appId;
        this.init();
    }
    
    init() {
        this.render();
    }
    
    render() {
        const content = this.window.querySelector('.dex-window-content');
        content.innerHTML = '<h2>Calendar App - Coming Soon</h2>';
    }
    
    cleanup() {}
}

// Export apps for global access
window.SamsungApps = {
    FileManager,
    GalleryApp,
    BrowserApp,
    EmailApp,
    SettingsApp,
    CalculatorApp,
    CalendarApp
}; 
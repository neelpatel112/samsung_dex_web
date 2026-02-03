/* ===== SAMSUNG DEX UI COMPONENTS ===== */

// Add additional CSS for apps
const appStyles = `
    /* File Manager Styles */
    .file-manager {
        display: flex;
        height: 100%;
        background: rgba(40, 45, 60, 0.8);
    }
    
    .file-manager-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .toolbar-left, .toolbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .toolbar-btn {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.07);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .toolbar-btn:hover {
        background: rgba(255, 255, 255, 0.12);
    }
    
    .path-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        margin-left: 12px;
        font-size: 13px;
    }
    
    .path-segment {
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .path-segment:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .file-manager-sidebar {
        width: 240px;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        padding: 16px;
        overflow-y: auto;
    }
    
    .sidebar-section {
        margin-bottom: 24px;
    }
    
    .sidebar-section h3 {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 12px;
    }
    
    .sidebar-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 4px;
        font-size: 13px;
    }
    
    .sidebar-item:hover {
        background: rgba(255, 255, 255, 0.05);
    }
    
    .sidebar-item.active {
        background: rgba(66, 133, 244, 0.2);
        color: #4285f4;
    }
    
    .sidebar-item i {
        width: 20px;
        text-align: center;
    }
    
    .storage-info {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        margin-left: auto;
    }
    
    .file-manager-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 16px;
    }
    
    .file-grid {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
        overflow-y: auto;
    }
    
    .file-item {
        padding: 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .file-item:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateY(-2px);
    }
    
    .file-icon {
        font-size: 32px;
        color: #4285f4;
        margin-bottom: 12px;
    }
    
    .file-name {
        font-weight: 500;
        font-size: 13px;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .file-size, .file-modified {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
    }
    
    .file-info-bar {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
    }
    
    /* Gallery Styles */
    .gallery-app {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(40, 45, 60, 0.8);
    }
    
    .gallery-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .gallery-container {
        flex: 1;
        display: flex;
    }
    
    .gallery-sidebar {
        width: 200px;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        padding: 16px;
        overflow-y: auto;
    }
    
    .gallery-content {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
    }
    
    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
    }
    
    .image-item {
        border-radius: 12px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.03);
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .image-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
    
    .image-thumbnail {
        aspect-ratio: 4/3;
        position: relative;
        overflow: hidden;
    }
    
    .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
        opacity: 0;
        transition: opacity 0.2s ease;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        padding: 12px;
        gap: 8px;
    }
    
    .image-item:hover .image-overlay {
        opacity: 1;
    }
    
    .image-btn {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        color: #333;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .image-btn:hover {
        background: white;
        transform: scale(1.1);
    }
    
    .image-info {
        padding: 12px;
    }
    
    .image-name {
        font-weight: 500;
        font-size: 13px;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .image-details {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        display: flex;
        gap: 4px;
    }
    
    /* Browser Styles */
    .browser-app {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(40, 45, 60, 0.8);
    }
    
    .browser-toolbar {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        gap: 12px;
    }
    
    .url-bar {
        flex: 1;
        display: flex;
        gap: 8px;
    }
    
    #url-input {
        flex: 1;
        padding: 10px 16px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: white;
        font-size: 13px;
    }
    
    .url-btn {
        padding: 10px 20px;
        background: #4285f4;
        border: none;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .url-btn:hover {
        background: #3367d6;
    }
    
    .browser-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
    }
    
    .page-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        gap: 16px;
    }
    
    .loading-spinner {
        font-size: 32px;
        color: #4285f4;
    }
    
    .loading-text {
        color: rgba(255, 255, 255, 0.7);
    }
    
    .webpage {
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .page-header {
        margin-bottom: 30px;
    }
    
    .page-header h1 {
        font-size: 32px;
        margin-bottom: 8px;
    }
    
    .page-header p {
        color: rgba(255, 255, 255, 0.7);
    }
    
    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }
    
    .product-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    }
    
    .product-image {
        height: 160px;
        width: 100%;
    }
    
    .product-info {
        padding: 16px;
    }
    
    .product-info h3 {
        margin-bottom: 8px;
        font-size: 18px;
    }
    
    .product-info p {
        color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
    }
    
    .browser-tabs {
        display: flex;
        gap: 4px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.03);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .tab {
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.07);
        border-radius: 8px 8px 0 0;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 13px;
    }
    
    .tab.active {
        background: rgba(66, 133, 244, 0.2);
        color: #4285f4;
    }
    
    .tab-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }
    
    .tab-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    /* Email Styles */
    .email-app {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: rgba(40, 45, 60, 0.8);
    }
    
    .email-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    #compose-email {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: #4285f4;
        border: none;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        font-weight: 500;
    }
    
    .email-container {
        flex: 1;
        display: flex;
    }
    
    .email-sidebar {
        width: 200px;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        padding: 16px;
    }
    
    .email-content {
        flex: 1;
        display: flex;
    }
    
    .email-list {
        width: 350px;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        overflow-y: auto;
    }
    
    .email-view {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
    }
    
    .email-item {
        display: grid;
        grid-template-columns: auto auto 150px 1fr auto;
        gap: 12px;
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .email-item:hover {
        background: rgba(255, 255, 255, 0.03);
    }
    
    .email-item.unread {
        background: rgba(66, 133, 244, 0.05);
    }
    
    .email-select input {
        margin: 0;
    }
    
    .star-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        font-size: 16px;
        padding: 0;
    }
    
    .star-btn.starred {
        color: #fbbc05;
    }
    
    .email-from {
        font-weight: 500;
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .email-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }
    
    .email-subject {
        font-weight: 500;
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .unread-dot {
        width: 8px;
        height: 8px;
        background: #4285f4;
        border-radius: 50%;
    }
    
    .email-preview {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .email-time {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        text-align: right;
    }
    
    .empty-email-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        gap: 16px;
        color: rgba(255, 255, 255, 0.5);
    }
    
    .empty-email-view i {
        font-size: 48px;
    }
    
    .email-detail {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .email-header {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .email-subject-large {
        font-size: 24px;
        margin-bottom: 8px;
    }
    
    .email-from-large {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 4px;
    }
    
    .email-time-large {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
    }
    
    .email-body {
        line-height: 1.6;
        margin-bottom: 30px;
    }
    
    .email-actions {
        display: flex;
        gap: 12px;
    }
    
    .email-action-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.07);
        border: none;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        font-size: 13px;
    }
    
    .compose-email {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .compose-header {
        margin-bottom: 20px;
    }
    
    .form-field {
        margin-bottom: 16px;
    }
    
    .form-field input,
    .form-field textarea {
        width: 100%;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: white;
        font-size: 13px;
    }
    
    .compose-actions {
        display: flex;
        gap: 12px;
    }
    
    .compose-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }
    
    .send-btn {
        background: #4285f4;
        color: white;
    }
    
    .discard-btn {
        background: rgba(255, 255, 255, 0.07);
        color: white;
    }
    
    /* Settings Styles */
    .settings-app {
        display: flex;
        height: 100%;
        background: rgba(40, 45, 60, 0.8);
    }
    
    .settings-sidebar {
        width: 240px;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        padding: 20px;
    }
    
    .settings-content {
        flex: 1;
        padding: 30px;
        overflow-y: auto;
    }
    
    .settings-section {
        display: none;
        max-width: 800px;
    }
    
    .settings-section.active {
        display: block;
    }
    
    .settings-group {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 12px;
        padding: 20px;
        margin-top: 20px;
    }
    
    .setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .setting-item:last-child {
        border-bottom: none;
    }
    
    .setting-item label {
        font-weight: 500;
    }
    
    .setting-item select {
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: white;
        min-width: 200px;
    }
    
    .about-info {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 12px;
        padding: 20px;
        margin-top: 20px;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .info-item:last-child {
        border-bottom: none;
    }
    
    /* Context Menu */
    .context-menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 10px 12px;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.2s ease;
        font-size: 13px;
    }
    
    .context-menu-item:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .context-menu-item i {
        width: 16px;
        text-align: center;
    }
    
    /* Scrollbar for all apps */
    .dex-window-content::-webkit-scrollbar {
        width: 8px;
    }
    
    .dex-window-content::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 4px;
    }
    
    .dex-window-content::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = appStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Samsung DeX UI Components Loaded');
});
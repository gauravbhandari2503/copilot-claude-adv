function init() {
    console.log('Multi-App Suite initialized');
    console.log('App version: 2.0.0');
    console.log('Author: Copilot');
    console.log('Each application is now organized in its own dedicated folder');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

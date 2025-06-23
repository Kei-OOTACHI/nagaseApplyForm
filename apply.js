// This file is a backup/alias for code.js to maintain compatibility
// It will load the main code.js functionality

// Load the main code.js file
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = require('./code.js');
} else {
    // Browser environment - redirect to code.js
    document.addEventListener('DOMContentLoaded', function() {
        var script = document.createElement('script');
        script.src = './code.js';
        document.head.appendChild(script);
    });
} 
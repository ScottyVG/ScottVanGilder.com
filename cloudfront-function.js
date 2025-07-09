function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Handle blog routes specifically
    if (uri === '/blog' || uri === '/blog/') {
        request.uri = '/blog/index.html';
        return request;
    }
    
    // Handle individual blog post routes
    if (uri.startsWith('/blog/') && !uri.endsWith('.html') && !uri.includes('.')) {
        // Remove trailing slash if present
        var cleanUri = uri.endsWith('/') ? uri.slice(0, -1) : uri;
        request.uri = cleanUri + '/index.html';
        return request;
    }
    
    // Handle other routes that might need index.html
    if (uri.endsWith('/') && uri !== '/') {
        request.uri = uri + 'index.html';
        return request;
    }
    
    // For URLs without extensions and not root, try adding /index.html
    if (!uri.includes('.') && uri !== '/' && !uri.startsWith('/_next/')) {
        request.uri = uri + '/index.html';
        return request;
    }
    
    return request;
}
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Handle routes that might need index.html
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

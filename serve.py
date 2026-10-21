import http.server
import socketserver
import os
import sys

PORT = 8080
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')

class SmartCampusPreviewHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_GET(self):
        # Clean URL paths: '/' or empty redirects/serves preview.html
        if self.path in ('/', '/index.html', ''):
            self.path = '/preview.html'
        return super().do_GET()

    def end_headers(self):
        # Disable aggressive caching so updates appear immediately
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True

if __name__ == '__main__':
    with socketserver.TCPServer(('0.0.0.0', PORT), SmartCampusPreviewHandler) as httpd:
        print(f"SmartCampus Preview server listening on http://0.0.0.0:{PORT} (root -> preview.html)")
        sys.stdout.flush()
        httpd.serve_forever()

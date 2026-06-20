#!/bin/bash
# Start a simple HTTP server on port 80 in the background for Render's port check
python3 -c '
import http.server
import socketserver

PORT = 80
class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(b"OK")

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print("Serving health check on port", PORT)
    httpd.serve_forever()
' &

# Now call the original MySQL entrypoint
exec docker-entrypoint.sh "$@"

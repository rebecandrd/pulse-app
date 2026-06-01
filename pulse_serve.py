import http.server, functools

app_dir = "/tmp/pulse-app-preview"

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()

handler = functools.partial(NoCacheHandler, directory=app_dir)
httpd = http.server.HTTPServer(("", 3000), handler)
httpd.serve_forever()

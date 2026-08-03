#!/usr/bin/env python3
"""Yerel önizleme sunucusu — /Users/akc/Documents/LAMOZZA kökünden servis eder."""
import os, sys, functools, http.server, socketserver

KOK = "/Users/akc/Documents/LAMOZZA"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8099
os.chdir(KOK)


class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            try:
                with open(os.path.join(KOK, "404.html"), "rb") as f:
                    govde = f.read()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(govde)))
                self.end_headers()
                self.wfile.write(govde)
                return
            except OSError:
                pass
        super().send_error(code, message, explain)


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), functools.partial(H, directory=KOK)) as httpd:
    print("La Mozza önizleme: http://localhost:%d/" % PORT, flush=True)
    httpd.serve_forever()

"""Lokalny serwer do testów (bez cache przeglądarki): python tools/devserver.py [port]"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class NoCache(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.webmanifest': 'application/manifest+json', '.js': 'text/javascript'}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
root = Path(__file__).resolve().parent.parent
ThreadingHTTPServer(('127.0.0.1', port), partial(NoCache, directory=str(root))).serve_forever()

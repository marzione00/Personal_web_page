"""Compatibility entry point. The current checks are in browser-explorer.py."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('browser-explorer.py')),run_name='__main__')

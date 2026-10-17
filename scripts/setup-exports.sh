#!/usr/bin/env bash
# User-local, pinned document tools. Does not modify shell startup or system configuration.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .tools .cache/tool-downloads
if [[ ! -x .tools/pandoc-3.12.1/bin/pandoc ]]; then
  curl -fsSL --retry 3 https://github.com/jgm/pandoc/releases/download/3.12.1/pandoc-3.12.1-linux-amd64.tar.gz -o .cache/tool-downloads/pandoc.tar.gz
  echo 'd0c90410e90204c9ca83b8539fac5c7aed01fd537207e4585849f8abc5df20b8  .cache/tool-downloads/pandoc.tar.gz' | sha256sum --check --status
  tar -xzf .cache/tool-downloads/pandoc.tar.gz -C .tools
fi
if [[ ! -f .tools/epubcheck-5.4.0/epubcheck.jar ]]; then
  curl -fsSL --retry 3 https://github.com/w3c/epubcheck/releases/download/v5.4.0/epubcheck-5.4.0.zip -o .cache/tool-downloads/epubcheck.zip
  echo '33350c61038e71dfb3d45a76aed04bf5481e6d5500cb780f6e98db8bbd15a28c  .cache/tool-downloads/epubcheck.zip' | sha256sum --check --status
  python3 -c 'import zipfile; zipfile.ZipFile(".cache/tool-downloads/epubcheck.zip").extractall(".tools")'
fi
command -v xelatex >/dev/null || { echo 'XeLaTeX required. See README or Dockerfile.exports.'; exit 1; }
command -v java >/dev/null || { echo 'Java 17+ required for EPUBCheck.'; exit 1; }
.tools/pandoc-3.12.1/bin/pandoc --version | head -1
xelatex --version | head -1
java -version

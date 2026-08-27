# Vite needs Node ^20.19 || >=22.12.
FROM node:24

# jq builds installed-versions.json. The rest are the shared libraries
# Puppeteer's Chrome needs to start, which the base image does not carry.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      jq \
      ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 \
      libatk1.0-0 libcairo2 libcups2 libdbus-1-3 libdrm2 libexpat1 \
      libgbm1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 \
      libx11-6 libxcb1 libxcomposite1 libxdamage1 libxext6 libxfixes3 \
      libxkbcommon0 libxrandr2 xdg-utils \
 && rm -rf /var/lib/apt/lists/*

CMD "bash"

FROM ghcr.io/puppeteer/puppeteer:22.10.0

ENV PUPPETEER_SKIP_CHROME_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

# Run TypeScript build step
RUN npm run build

CMD ["node", "dist/index.js"]

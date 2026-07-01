FROM mcr.microsoft.com/devcontainers/typescript-node:24-trixie

ARG PNPM_VERSION=11.9.0

RUN npm install -g "pnpm@${PNPM_VERSION}" \
  && npm cache clean --force > /dev/null 2>&1

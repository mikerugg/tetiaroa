FROM mcr.microsoft.com/devcontainers/typescript-node:24-trixie

ARG PNPM_VERSION=11.9.0
ARG AGENT_BROWSER_VERSION=latest

RUN npm install -g "pnpm@${PNPM_VERSION}" "agent-browser@${AGENT_BROWSER_VERSION}" \
  && npm cache clean --force > /dev/null 2>&1

FROM node:lts
ARG DEV
COPY . /PoliChess-BACK/
WORKDIR /PoliChess-BACK/
RUN mkdir -p config
RUN printf "%s" "$DEV" > config/.env.development
RUN npm i
# ENTRYPOINT [ "npm", "run", "dev" ]
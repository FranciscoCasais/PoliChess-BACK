FROM node:lts
ARG DEV_FILE
COPY . /PoliChess-BACK/
WORKDIR /PoliChess-BACK/
RUN mkdir -p config
RUN cat $DEV_FILE > config/.env.development
RUN npm i
ENTRYPOINT [ "npm", "run", "dev" ]
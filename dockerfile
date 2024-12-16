FROM node:lts
ARG DEV
COPY . /PoliChess-BACK/
WORKDIR /PoliChess-BACK/
RUN mkdir -p config
RUN echo "$DEV" > config/.env.development
RUN npm i
ENTRYPOINT [ "npm", "run", "dev" ]
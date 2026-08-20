# Vite needs Node ^20.19 || >=22.12.
FROM node:20

RUN apt-get update \
 && apt-get install -y jq

CMD "bash"

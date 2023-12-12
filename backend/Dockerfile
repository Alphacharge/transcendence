FROM node:lts

WORKDIR /backend/

COPY entrypoint.sh /script/entrypoint.sh
RUN chmod 777 /script/entrypoint.sh
ENTRYPOINT ["/script/entrypoint.sh"]

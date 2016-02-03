FROM mhart/alpine-node:4

RUN apk add --update --virtual build-dependencies \
    git make gcc g++ python

VOLUME ["/app/server/config" ]

COPY app /app/app
COPY grunttasks /app/grunttasks
COPY locale /app/locale
COPY scripts /app/scripts
COPY server /app/server
ADD AUTHORS /app/AUTHORS
ADD CHANGELOG.md /app/CHANGELOG.md
ADD LICENSE /app/LICENSE
ADD README.md /app/README.md
ADD package.json /app/package.json
ADD npm-shrinkwrap.json /app/npm-shrinkwrap.json

# ENV DISABLE_CLIENT_METRICS_STDERR=
# ENV DISABLE_ROUTE_LOGGING=

ENV NODE_ENV=production
ENV FXA_URL=http://127.0.0.1:9000
ENV HTTP_PORT=3080

# ENV I18N_SUPPORTED_LANGUAGES=
# ENV I18N_TRANSLATION_DIR=
# ENV I18N_TRANSLATION_TYPE=

ENV LOG_LEVEL=info

# ENV FXA_MARKETING_EMAIL_API_URL=http://127.0.0.1:1114
# ENV FXA_MARKETING_EMAIL_PREFERENCES_URL=

ENV FXA_OAUTH_CLIENT_ID=
ENV FXA_OAUTH_URL=http://127.0.0.1:9010

ENV PORT=3030

ENV FXA_PROFILE_IMAGES_URL=http://127.0.0.1:1112
ENV FXA_PROFILE_URL=FXA_PROFILE_URL

ENV PUBLIC_URL=http://127.0.0.1:3030

ENV REDIRECT_PORT=80

ENV ENABLE_STATSD=false

# ENV VAR_PATH=

EXPOSE 3030

WORKDIR /app

RUN npm i

RUN apk del build-dependencies && \
    rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

ENTRYPOINT exec npm start

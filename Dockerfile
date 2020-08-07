FROM node:latest AS build-env

ENV APP_ENV development

WORKDIR /tmp
COPY . .
# RUN node --max_old_space_size=8192
RUN npm install \
    && npm run build:$APP_ENV --prod

FROM nginx:latest
EXPOSE 80
COPY --from=build-env /tmp/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
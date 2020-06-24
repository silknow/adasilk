FROM d2klab/explorer

ADD ./.env /usr/src/app/
ADD ./config.js /usr/src/app/
ADD ./theme.js /usr/src/app/
ADD ./images /usr/src/app/public/images
ADD ./locales /usr/src/app/public/static/locales

RUN npm run build

CMD [ "npm", "start" ]
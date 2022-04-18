FROM node:latest
#RUN mkdir -p /opt/app
WORKDIR /app
COPY . .
RUN yarn install
#RUN chown -R app:app /opt/app
#USER app
EXPOSE 3000
#CMD [ "npm", "run", "pm2" ]
CMD [ "npm", "run", "dev" ]

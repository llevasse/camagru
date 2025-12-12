FROM nginx:alpine

RUN apk add --no-cache openssl nodejs npm

RUN openssl req -x509 -nodes -newkey rsa:2048 \
	-keyout /etc/ssl/private/camagru.key \
	-out /etc/ssl/certs/camagru.crt \
	-subj "/C=FR/ST=Auvergne-Rhone-Alpes/L=Lyon/O=42/CN=localhost/emailAddress=llevasse@student.42lyon.fr"

COPY conf /etc/nginx/conf.d

COPY ./entry/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh


ENTRYPOINT [ "entrypoint.sh" ]
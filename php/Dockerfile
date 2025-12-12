FROM php:8.1.33-fpm

RUN docker-php-ext-install mysqli pdo pdo_mysql
RUN docker-php-ext-enable mysqli

COPY conf/www.conf /etc/php/7.4/fpm/pool.d/www.conf

CMD ["php-fpm"]
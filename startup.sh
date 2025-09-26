#!/bin/sh
cp /usr/local/etc/redis/redis.conf /tmp/redis_temp.conf
sed -i "s/%REDIS_PASSWORD%/$REDIS_PASSWORD/" /tmp/redis_temp.conf
exec redis-server /tmp/redis_temp.conf

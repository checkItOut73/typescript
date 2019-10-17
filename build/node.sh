docker run \
    --rm \
    --interactive \
    --volume /$(pwd)://var/www/html \
    --workdir //var/www/html \
    node:10.16.3 $@

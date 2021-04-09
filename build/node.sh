PWD=$(pwd)
DIR=${PWD//cygdrive\//}

docker run \
    --rm \
    --interactive \
    --volume /${DIR}://var/www/html \
    --workdir //var/www/html \
    node:12.13.0 $@

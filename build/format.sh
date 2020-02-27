if [ -z "$1" ]
    then
        ./build/npm.sh run format
    else
        ./build/node.sh node_modules/.bin/prettier \
            --write "${1//\\//}"
fi

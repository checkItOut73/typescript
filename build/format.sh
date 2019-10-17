if [ -z "$1" ]
    then
        ./build/npm.sh run format
    else
        ./build/node.sh node_modules/.bin/prettier \
            --config build/configs/.prettierrc \
            --ignore-path build/configs/.prettierignore \
            --write "${1//\\//}"
fi

./build/npm.sh install
./build/npm.sh run build:server

if [ -d "./.idea" ]
then
    ./build/npm.sh run copy:idea
fi

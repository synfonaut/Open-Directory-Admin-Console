
        ___                     ____  _               _                        _       _           _
       / _ \ _ __   ___ _ __   |  _ \(_)_ __ ___  ___| |_ ___  _ __ _   _     / \   __| |_ __ ___ (_)_ __ 
      | | | | '_ \ / _ \ '_ \  | | | | | '__/ _ \/ __| __/ _ \| '__| | | |   / _ \ / _` | '_ ` _ \| | '_ \ 
      | |_| | |_) |  __/ | | | | |_| | | | |  __/ (__| || (_) | |  | |_| |  / ___ \ (_| | | | | | | | | | |
       \___/| .__/ \___|_| |_| |____/|_|_|  \___|\___|\__\___/|_|   \__, | /_/   \_\__,_|_| |_| |_|_|_| |_|
            |_|                                                     |___/                                  

## Open Directory Admin

Open Directory Admin let's you perform critical admin-only tasks on your directory, like updating to a new version and detatching directories you don't want listed publicly.

The admin channel is just a custom Bitcom protocol, that creates a channel where you can sign and send messages to only your channel.

## Usage

    Usage: ./opendirectory-admin <action> [options]

        show           show information about this opendirectory admin
        uri            get current application uri
        uris           show all uris
        update_uri     redirect application to new uri
        detach         detach a specific category from view
        attach         attach a previously detatched category back into view
        log            show recent actions
        help



## Getting Started

    # install
    mkdir opendirectory-admin
    cd opendirectory-admin
    npm install bitcom
    npm install opendirectory-admin

    # initialize admin address
    bit init
    bit useradd

    # create new version
    node cli.js update_uri bit://new-uri-goes-here

    # show log
    node cli.js log

    # help
    node cli.js help

## TODO

* Add message for attach/detach
* Add message for version... changelog?


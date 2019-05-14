
           ___                     ____  _               _                        _       _           _       
          / _ \ _ __   ___ _ __   |  _ \(_)_ __ ___  ___| |_ ___  _ __ _   _     / \   __| |_ __ ___ (_)_ __  
         | | | | '_ \ / _ \ '_ \  | | | | | '__/ _ \/ __| __/ _ \| '__| | | |   / _ \ / _` | '_ ` _ \| | '_ \ 
         | |_| | |_) |  __/ | | | | |_| | | | |  __/ (__| || (_) | |  | |_| |  / ___ \ (_| | | | | | | | | | |
          \___/| .__/ \___|_| |_| |____/|_|_|  \___|\___|\__\___/|_|   \__, | /_/   \_\__,_|_| |_| |_|_|_| |_|
               |_|                                                     |___/                                  

## Open Directory Admin

Open Directory admin let's you perform critical admin-only tasks on your directory

* update_uri -> redirect users to a new url
* detach -> remove a directory from public listing
* attach -> re-add a directory to public listing

## Getting Started

    mkdir opendirectory-admin
    cd opendirectory-admin
    npm install bitcom
    npm install opendirectory-admin
    bit init
    bit useradd
    node cli.js update_uri bit://new-uri-goes-here

    node cli.js log

    node cli.js help


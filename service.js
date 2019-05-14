const axios = require("axios");
const datapay = require('datapay')

const fs = require("fs");
const ini = require("ini");

const SETTINGS = {
    "api_key": "1D23Q8m3GgPFH15cwseLFZVVGSNg3ypP2z",
    "api_endpoint": "https://bitomation.com/{api_action}/{api_key}/{query}",
};

function toBase64(str) {
    return Buffer.from(str).toString('base64');
}

function getBitSecrets(file=".bit") {
    try {
        const contents = fs.readFileSync(file, "utf8");
        const bits = ini.decode(contents);

        if (!bits) {
            throw "error while reading .bit file, initialize bitcom with `bit init` and `bit useradd` first";
        }

        if (!bits.PRIVATE || !bits.PUBLIC || !bits.ADDRESS) {
            throw "error while reading .bit file, initialize bitcom with `bit init` and `bit useradd` first";
        }

        return bits;
    } catch (e) {
        console.log("ERROR while reading .bit — ", e.message);
        return null;
    }
}

const ALLOWED_ACTIONS = [
    "uri",
    "attach",
    "detach",
];

function fetchAdminActions(admin_address) {
    const query = {
        "v": 3,
        "sort": {
            "txid": 1
        },
        "q": {
            "find": {
                "out.s1": admin_address,
                "in.e.a": admin_address,
            },
            "limit": 9999 // can eventually do paging here if necessary, admin log should stay small though
        },
        "r": {
            "f": "[.[] | {\"height\": .blk.i, \"address\": .in[0].e.a, \"txid\": .tx.h, \"data\": .out[0] | with_entries(select(((.key | startswith(\"s\")) and (.key != \"str\"))))}]"
        }
    };

    const encoded_query = toBase64(JSON.stringify(query));
    const api_url = SETTINGS["api_endpoint"].replace("{api_key}", SETTINGS.api_key).replace("{api_action}", "q");;
    const url = api_url.replace("{query}", encoded_query);
    const header = { headers: { key: SETTINGS.api_key } };

    return new Promise((resolve, reject) => {
        axios(url, header).then(function(r) {
            if (!r) {
                reject("Error response while checking updater");
            } else if (r.status !== 200) {
                reject("Error response status code while checking updater " + r.status);
            } else {
                const data = r.data;
                const results = data.c.concat(data.u);

                const sorted = results.sort(function(a, b) {
                    return (a.height===null)-(b.height===null) || +(a.height>b.height) || -(a.height<b.height);
                });

                resolve(sorted);
            }
        });
    });
}

function processResult(result) {
    const action = result.data.s2;

    if (ALLOWED_ACTIONS.indexOf(action) == -1) {
        return null;
    }

    const object = {
        "height": result.height,
        "txid": result.txid,
        "action": action,
    }

    if (action == "uri") {
        const uri = result.data.s3;
        object.uri = uri;
    } else if (action == "attach" || action == "detach") {
        object.action_id = result.data.s3;
    } else {
        object.data = result.data;
    }

    return object;
}

function processResults(results) {
    return results.map(processResult).filter(r => { return r });
}

function fetchLog(admin_address) {
    return new Promise((resolve, reject) => {
        fetchAdminActions(admin_address).then(results => {
            resolve(processResults(results));
        }).catch(reject);
    });
}

function fetchURIs(admin_address) {
    return new Promise((resolve, reject) => {
        fetchAdminActions(admin_address).then(raw => {
            const results = processResults(raw);
            const uris = results.filter(r => { return r.action == "uri" });
            resolve(uris);
        }).catch(reject);
    });
}

function updateApplicationURI(uri) { 
    return sendDataToBlockchain(["uri", uri]);
}

function attachCategoryTXID(category_txid) { 
    return sendDataToBlockchain(["attach", category_txid]);
}

function detachCategoryTXID(category_txid) { 
    return sendDataToBlockchain(["detach", category_txid]);
}

function sendDataToBlockchain(data) {
    return new Promise((resolve, reject) => {

        const bits = getBitSecrets();

        if (!bits.ADDRESS) {
            reject("invalid protocol_address");
            return;
        }

        if (!bits.PRIVATE) {
            reject("invalid private key");
            return;
        }

        if (!data || data.length == 0) {
            reject("invalid data");
            return;
        }

        const OP_RETURN = [
            bits.ADDRESS
        ].concat(data);

        // console.log("Sending", OP_RETURN);

        datapay.send({
            data: OP_RETURN,
            pay: { key: bits.PRIVATE}
        }, function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

module.exports = { fetchAdminActions, processResults, fetchLog, fetchURIs, updateApplicationURI, getBitSecrets, attachCategoryTXID, detachCategoryTXID };


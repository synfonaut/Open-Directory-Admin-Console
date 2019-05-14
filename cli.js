const argv = require("minimist")(process.argv.slice(2));
const Confirm = require("prompt-confirm");
const args = argv._;

const service = require("./service");

function error(msg) {
    console.log("ERROR: " + msg);
}

function success(msg) {
    console.log("SUCCESS: " + msg);
}

function show(tx) {
    console.log(tx.action);
    console.log(" txid", tx.txid);
    console.log(" height", tx.height);
    delete tx.txid;
    delete tx.action;
    delete tx.height;
    console.log(" ", tx);
    console.log("");
}

function usage() {
    console.log("Usage: ./opendirectory-admin <action> [options]");
    console.log("");
    console.log("    uri            get current application uri");
    console.log("    uris           show all uris");
    console.log("    update_uri     redirect application to new uri");
    console.log("    detach         detach a specific category from view");
    console.log("    attach         attach a previously detatched category back into view");
    console.log("    log            show recent actions");
    console.log("    help");
    console.log("");
}

const cmd = args[0];

const bits = service.getBitSecrets();
if (!bits) { process.exit(-1) }

if (cmd == "log") {

    service.fetchLog(bits.ADDRESS).then(logs => {
        console.log("showing logs");
        for (const log of logs) { show(log) }
        console.log("found", logs.length, "logs");
    }).catch(e => {
        error(e.message);
    });

} else if (cmd == "uris") {

    service.fetchURIs(bits.ADDRESS).then(uris => {
        console.log("showing uris");
        for (const uri of uris) { show(uri) }
        console.log("found", uris.length, "uris");
    }).catch(e => {
        error(e.message);
    });

} else if (cmd == "uri") {

    service.fetchURIs(bits.ADDRESS).then(uris => {
        if (uris.length > 0) {
            console.log("showing current uri");
            show(uris[uris.length - 1]);
        } else {
            console.log("there are no uris");
        }
    }).catch(e => {
        error(e.message);
    });

} else if (cmd == "update_uri") {

    if (args.length != 2) {
        error("update_uri expects a single parameter, a new URL to redirect users to, like bit://abc/1234");
        return;
    }

    const uri = args[1];

    if (!argv.confirm && uri.indexOf("bit://") !== 0) {
        error("This link doesn't start with bit://, which is the best way to reference your application — to continue re-run this command with --confirm");
        return;
    }

    const prompt = new Confirm('Are you sure you want to update to URL ' + uri);
    prompt.ask(function(answer) {
        if (!answer) { return }

        service.updateApplicationURI(uri).then(txid => {
            success("successfully updated application URL to " + uri);
            console.log("tx: " + txid);
            console.log("http://whatsonchain.com/tx/" + txid);
            console.log("");
            console.log("go check your application URL to confirm the redirect appears. note updates are cached, so clear your localStorage last_update_timestamp to force check");
        }).catch((e) => {
            console.log("An error occured while updating the application URI");
            error(e);
        });
    });

} else if (cmd == "attach") {

    if (args.length != 2) {
        error("attach expects a single parameter, a category_txid to attach, like 8a1cb246c9710554891478c0afaeeba1fb1e99ea0904315578694cf04f6ba01b");
        return;
    }

    const category_txid = args[1];
    if (category_txid.length !== 64) {
        error("invalid category, please enter a valid category txid");
        return;
    }

    const prompt = new Confirm('Are you sure you want to attach category txid ' + category_txid);
    prompt.ask(function(answer) {
        if (!answer) { return }

        service.attachCategoryTXID(category_txid).then(txid => {
            success("successfully attached category_txid " + category_txid);
            console.log("tx: " + txid);
            console.log("http://whatsonchain.com/tx/" + txid);
            console.log("");
            console.log("go check your application URL to confirm the attach happened");
        }).catch((e) => {
            console.log("An error occured while attaching the category_txid");
            error(e);
        });
    });

} else if (cmd == "detach") {

    if (args.length != 2) {
        error("detach expects a single parameter, a category_txid to detach, like 8a1cb246c9710554891478c0afaeeba1fb1e99ea0904315578694cf04f6ba01b");
        return;
    }

    const category_txid = args[1];
    if (category_txid.length !== 64) {
        error("invalid category, please enter a valid category txid");
        return;
    }

    const prompt = new Confirm('Are you sure you want to detach category txid ' + category_txid);
    prompt.ask(function(answer) {
        if (!answer) { return }

        service.detachCategoryTXID(category_txid).then(txid => {
            success("successfully detached category_txid " + category_txid);
            console.log("tx: " + txid);
            console.log("http://whatsonchain.com/tx/" + txid);
            console.log("");
            console.log("go check your application URL to confirm the detach happened");
        }).catch((e) => {
            console.log("An error occured while detaching the category_txid");
            error(e);
        });
    });

} else if (!cmd || cmd == "help") {
    usage();
} else {
    error("unknown command");
    usage();
}


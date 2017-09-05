"use strict";
Promise = require('bluebird');
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

class FabricConnection {

    // Returns a promise that results in a new connected FabricConnection
    static createConnection(id, secret) {

        const connection = new FabricConnection();
        connection.connection = new BusinessNetworkConnection();
        return connection.connection.connect(process.env.connect_profile_name,
            process.env.business_network,
            id,
            secret
        ).then((def) => {
            connection.definition = def;
            return connection;
        });
    }
}

module.exports = FabricConnection;

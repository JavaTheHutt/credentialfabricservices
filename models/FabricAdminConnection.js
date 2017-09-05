"use strict";
Promise = require('bluebird');
const uuid = require('uuid').v4;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

class FabricAdminConnection {

    // Returns a promise that results in a new connected FabricConnection
    static createAdminConnection() {

        const connection = new FabricAdminConnection();
        connection.connection = new BusinessNetworkConnection();
        return connection.connection.connect(process.env.connect_profile_name,
            process.env.business_network,
            process.env.admin_userid,
            process.env.admin_secret
        ).then((def) => {
            connection.definition = def;
            return connection;
        });
    }

    // Returns a new user with corresponding Participant Type
    // Or null if there is a duplicate
    createUser(email, firstName, lastName, participantType) {
        const factory = this.definition.getFactory();
        let newUser = null;

        try {
            newUser = factory.newResource(process.env.name_space, participantType, email);
            newUser.firstName = firstName;
            newUser.lastName = lastName;
        } catch (e) {
            console.log(e);
            return null;
        }

        return this.connection.getParticipantRegistry(process.env.name_space + '.' + participantType)
            .then((participantRegistry) => {
                return participantRegistry.add(newUser);
            })
            .then(() => {
                return this.connection.issueIdentity(process.env.name_space + '.' + participantType + '#' + email, uuid());
            })
            .then((newUserCred) => {
                console.log(newUserCred);
                return {
                    userID: newUserCred.userID,
                    userSecret: newUserCred.userSecret,
                    email: email,
                    firstName: firstName,
                    lastName: lastName
                };
            })
            .catch((e) => {
                console.log(e);
                return null;
            });
    }

}

module.exports = FabricAdminConnection;

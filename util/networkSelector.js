const truebitgoerli = require("../client/goerli.json");
const truebitmain = require("../client/mainnet.json");

module.exports = {

    network: function(){
        var contract;
        switch (hre.network.name) {
            case "mainnet":
                contract = truebitmain;
                break;
            case "hardhat":
                contract = truebitgoerli;
                break;
            case "localhost":
                contract = truebitgoerli;
                break;
            case "goerli":
                contract = truebitgoerli;
                break;
        }
        return contract;
    }
}
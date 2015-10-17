/**
* Event.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    nodeId: {
      type: "string"
    },
    childSensorId: {
      type: "string"
    },
    messageType: {
      type: "string"
    },
    ack: {
      type: "string"
    },
    subType: {
      type: "string"
    },
    payload: {
      type: "string"
    }
  }
};


/**
 * MySensorsService.js
 *
 * Lib to parse mysensors data
 *
 * Use API 1.5
 */

var MySensors = {
    version: 1.5,

    messageType: {
        presentation: 0,
        set: 1,
        req: 2,
        internal: 3,
        stream: 4
    },
    valueType: {
        V_TEMP: 0,
        V_HUM: 1,
        V_STATUS: 2,
        V_LIGHT: 2,
        V_PERCENTAGE: 3,
        V_DIMMER: 3,
        V_PRESSURE: 4,
        V_FORECAST: 5,
        V_RAIN: 6,
        V_RAINRATE: 7,
        V_WIND: 8,
        V_GUST: 9,
        V_DIRECTION: 10,
        V_UV: 11,
        V_WEIGHT: 12,
        V_DISTANCE: 13,
        V_IMPEDANCE: 14,
        V_ARMED: 15,
        V_TRIPPED: 16,
        V_WATT: 17,
        V_KWH: 18,
        V_SCENE_ON: 19,
        V_SCENE_OFF: 20,
        V_HVAC_FLOW_STATE: 21,
        V_HVAC_SPEED: 22,
        V_LIGHT_LEVEL: 23,
        V_VAR1: 24,
        V_VAR2: 25,
        V_VAR3: 26,
        V_VAR4: 27,
        V_VAR5: 28,
        V_UP: 29,
        V_DOWN: 30,
        V_STOP: 31,
        V_IR_SEND: 32,
        V_IR_RECEIVE: 33,
        V_FLOW: 34,
        V_VOLUME: 35,
        V_LOCK_STATUS: 36,
        V_LEVEL: 37,
        V_VOLTAGE: 38,
        V_CURRENT: 39,
        V_RGB: 40,
        V_RGBW: 41,
        V_ID: 42,
        V_UNIT_PREFIX: 43,
        V_HVAC_SETPOINT_COOL: 44,
        V_HVAC_SETPOINT_HEAT: 45,
        V_HVAC_FLOW_MODE: 46
    },
    constant: {
        messageType: [
            {
                value: 0,
                label: "presentation",
                subType: [
                    {label: "S_DOOR", value: 0, allowedSubType: []},
                    {label: "S_MOTION", value: 1, allowedSubType: []},
                    {label: "S_SMOKE", value: 2, allowedSubType: []},
                    {label: "S_LIGHT", value: 3, allowedSubType: []},
                    {label: "S_BINARY", value: 3, allowedSubType: []},
                    {label: "S_DIMMER", value: 4, allowedSubType: []},
                    {label: "S_COVER", value: 5, allowedSubType: []},
                    {label: "S_TEMP", value: 6, allowedSubType: []},
                    {label: "S_HUM", value: 7, allowedSubType: []},
                    {label: "S_BARO", value: 8, allowedSubType: []},
                    {label: "S_WIND", value: 9, allowedSubType: []},
                    {label: "S_RAIN", value: 10, allowedSubType: []},
                    {label: "S_UV", value: 11, allowedSubType: []},
                    {label: "S_WEIGHT", value: 12, allowedSubType: []},
                    {label: "S_POWER", value: 13, allowedSubType: []},
                    {label: "S_HEATER", value: 14, allowedSubType: []},
                    {label: "S_DISTANCE", value: 15, allowedSubType: []},
                    {label: "S_LIGHT_LEVEL", value: 16, allowedSubType: []},
                    {label: "S_ARDUINO_NODE", value: 17, allowedSubType: []},
                    {label: "S_ARDUINO_REPEATER_NODE", value: 18, allowedSubType: []},
                    {label: "S_LOCK", value: 19, allowedSubType: []},
                    {label: "S_IR", value: 20, allowedSubType: []},
                    {label: "S_WATER", value: 21, allowedSubType: []},
                    {label: "S_AIR_QUALITY", value: 22, allowedSubType: []},
                    {label: "S_CUSTOM", value: 23, allowedSubType: []},
                    {label: "S_DUST", value: 24, allowedSubType: []},
                    {label: "S_SCENE_CONTROLLER", value: 25, allowedSubType: []},
                    {label: "S_RGB_LIGHT", value: 26, allowedSubType: []},
                    {label: "S_RGBW_LIGHT", value: 27, allowedSubType: []},
                    {label: "S_COLOR_SENSOR", value: 28, allowedSubType: []},
                    {label: "S_HVAC", value: 29, allowedSubType: []},
                    {label: "S_MULTIMETER", value: 30, allowedSubType: []},
                    {label: "S_SPRINKLER", value: 31, allowedSubType: []},
                    {label: "S_WATER_LEAK", value: 32, allowedSubType: []},
                    {label: "S_SOUND", value: 33, allowedSubType: []},
                    {label: "S_VIBRATION", value: 34, allowedSubType: []},
                    {label: "S_MOISTURE", value: 35, allowedSubType: []}
                ]
            },
            {
                value: 1,
                label: "set",
                subType: [
                    {label: "V_TEMP", value: 0},
                    {label: "V_HUM", value: 1},
                    {label: "V_STATUS", value: 2},
                    {label: "V_LIGHT", value: 2},
                    {label: "V_PERCENTAGE", value: 3},
                    {label: "V_DIMMER", value: 3},
                    {label: "V_PRESSURE", value: 4},
                    {label: "V_FORECAST", value: 5},
                    {label: "V_RAIN", value: 6},
                    {label: "V_RAINRATE", value: 7},
                    {label: "V_WIND", value: 8},
                    {label: "V_GUST", value: 9},
                    {label: "V_DIRECTION", value: 10},
                    {label: "V_UV", value: 11},
                    {label: "V_WEIGHT", value: 12},
                    {label: "V_DISTANCE", value: 13},
                    {label: "V_IMPEDANCE", value: 14},
                    {label: "V_ARMED", value: 15},
                    {label: "V_TRIPPED", value: 16},
                    {label: "V_WATT", value: 17},
                    {label: "V_KWH", value: 18},
                    {label: "V_SCENE_ON", value: 19},
                    {label: "V_SCENE_OFF", value: 20},
                    {label: "V_HVAC_FLOW_STATE", value: 21},
                    {label: "V_HVAC_SPEED", value: 22},
                    {label: "V_LIGHT_LEVEL", value: 23},
                    {label: "V_VAR1", value: 24},
                    {label: "V_VAR2", value: 25},
                    {label: "V_VAR3", value: 26},
                    {label: "V_VAR4", value: 27},
                    {label: "V_VAR5", value: 28},
                    {label: "V_UP", value: 29},
                    {label: "V_DOWN", value: 30},
                    {label: "V_STOP", value: 31},
                    {label: "V_IR_SEND", value: 32},
                    {label: "V_IR_RECEIVE", value: 33},
                    {label: "V_FLOW", value: 34},
                    {label: "V_VOLUME", value: 35},
                    {label: "V_LOCK_STATUS", value: 36},
                    {label: "V_LEVEL", value: 37},
                    {label: "V_VOLTAGE", value: 38},
                    {label: "V_CURRENT", value: 39},
                    {label: "V_RGB", value: 40},
                    {label: "V_RGBW", value: 41},
                    {label: "V_ID", value: 42},
                    {label: "V_UNIT_PREFIX", value: 43},
                    {label: "V_HVAC_SETPOINT_COOL", value: 44},
                    {label: "V_HVAC_SETPOINT_HEAT", value: 45},
                    {label: "V_HVAC_FLOW_MODE", value: 46}
                ]
            },
            {
                value: 2,
                label: "req",
                subType: [
                    {label: "V_TEMP", value: 0},
                    {label: "V_HUM", value: 1},
                    {label: "V_STATUS", value: 2},
                    {label: "V_LIGHT", value: 2},
                    {label: "V_PERCENTAGE", value: 3},
                    {label: "V_DIMMER", value: 3},
                    {label: "V_PRESSURE", value: 4},
                    {label: "V_FORECAST", value: 5},
                    {label: "V_RAIN", value: 6},
                    {label: "V_RAINRATE", value: 7},
                    {label: "V_WIND", value: 8},
                    {label: "V_GUST", value: 9},
                    {label: "V_DIRECTION", value: 10},
                    {label: "V_UV", value: 11},
                    {label: "V_WEIGHT", value: 12},
                    {label: "V_DISTANCE", value: 13},
                    {label: "V_IMPEDANCE", value: 14},
                    {label: "V_ARMED", value: 15},
                    {label: "V_TRIPPED", value: 16},
                    {label: "V_WATT", value: 17},
                    {label: "V_KWH", value: 18},
                    {label: "V_SCENE_ON", value: 19},
                    {label: "V_SCENE_OFF", value: 20},
                    {label: "V_HVAC_FLOW_STATE", value: 21},
                    {label: "V_HVAC_SPEED", value: 22},
                    {label: "V_LIGHT_LEVEL", value: 23},
                    {label: "V_VAR1", value: 24},
                    {label: "V_VAR2", value: 25},
                    {label: "V_VAR3", value: 26},
                    {label: "V_VAR4", value: 27},
                    {label: "V_VAR5", value: 28},
                    {label: "V_UP", value: 29},
                    {label: "V_DOWN", value: 30},
                    {label: "V_STOP", value: 31},
                    {label: "V_IR_SEND", value: 32},
                    {label: "V_IR_RECEIVE", value: 33},
                    {label: "V_FLOW", value: 34},
                    {label: "V_VOLUME", value: 35},
                    {label: "V_LOCK_STATUS", value: 36},
                    {label: "V_LEVEL", value: 37},
                    {label: "V_VOLTAGE", value: 38},
                    {label: "V_CURRENT", value: 39},
                    {label: "V_RGB", value: 40},
                    {label: "V_RGBW", value: 41},
                    {label: "V_ID", value: 42},
                    {label: "V_UNIT_PREFIX", value: 43},
                    {label: "V_HVAC_SETPOINT_COOL", value: 44},
                    {label: "V_HVAC_SETPOINT_HEAT", value: 45},
                    {label: "V_HVAC_FLOW_MODE", value: 46}
                ]
            },
            {
                value: 3,
                label: "internal",
                subType: [
                    {label: "I_BATTERY_LEVEL", value: 0},
                    {label: "I_TIME", value: 1},
                    {label: "I_VERSION", value: 2},
                    {label: "I_ID_REQUEST", value: 3},
                    {label: "I_ID_RESPONSE", value: 4},
                    {label: "I_INCLUSION_MODE", value: 5},
                    {label: "I_CONFIG", value: 6},
                    {label: "I_FIND_PARENT", value: 7},
                    {label: "I_FIND_PARENT_RESPONSE", value: 8},
                    {label: "I_LOG_MESSAGE", value: 9},
                    {label: "I_CHILDREN	10", value: 10},
                    {label: "I_SKETCH_NAME", value: 11},
                    {label: "I_SKETCH_VERSION", value: 12},
                    {label: "I_REBOOT", value: 13},
                    {label: "I_GATEWAY_READY", value: 14},
                    {label: "I_REQUEST_SIGNING", value: 15},
                    {label: "I_GET_NONCE", value: 16},
                    {label: "I_GET_NONCE_RESPONSE", value: 17}
                ]
            },
            {
                value: 4,
                label: "stream",
                subType: []
            }
        ]
    },
    getLabelType: function (valueType) {
        for (var i = 0; i < 5; i++) {
            if (this.constant.messageType[i].value === parseInt(valueType)) {
                return this.constant.messageType[i].label;
            }
        }

        return valueType;
    },
    getLabelSubType: function (valueType, valueSubtype) {
        var arraySubType = [];

        for (var e = 0; e < 5; e++) {
            if (this.constant.messageType[e].value === parseInt(valueType)) {
                arraySubType = this.constant.messageType[e].subType;
            }
        }


        for (var i = 0; i < arraySubType.length; i++) {
            if (arraySubType[i].value === parseInt(valueSubtype)) {
                return arraySubType[i].label;
            }
        }

        return valueSubtype;
    },
    /**
     * parse string and return object
     *
     * @param data
     */
    parse: function (data) {
        var splitedData = data.split(";");
        return {
            nodeId: splitedData[0],
            childSensorId: splitedData[1],
            messageType: this.getLabelType(splitedData[2]),
            ack: splitedData[3],
            subType: this.getLabelSubType(splitedData[2], splitedData[4]),
            payload: splitedData[5]
        }
    },
    /**
     * Create message to change state of actuator
     *
     * @param nodeId
     * @param childSensorId
     * @param messageType
     * @param subType
     * @param payload
     *
     * @returns {string}
     */
    createMessage: function (nodeId, childSensorId, messageType, subType, payload) {
        var msgObj = [
            nodeId,
            childSensorId,
            messageType,
            1,
            subType,
            payload
        ];

        return msgObj.join(';') + '\n';
    }
};

module.exports = MySensors;
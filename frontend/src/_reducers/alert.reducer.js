import CONSTANTS from '../_helpers/constants';
var defaultState = { msg: "", type: "" };

export function alert(state = defaultState, action) {
    switch (action.type) {
        case CONSTANTS.ALERT_CLEAR:
            return defaultState;
        case CONSTANTS.ALERT_SUCCESS:
            return Object.assign({}, state, { msg: action.msg, type: "alert-success" });
        case CONSTANTS.ALERT_INFO:
            return Object.assign({}, state, { msg: action.msg, type: "alert-info" });
        case CONSTANTS.ALERT_FAILURE:
            return Object.assign({}, state, { msg: action.msg, type: "alert-danger" });
        default:
            return state;
    }
}
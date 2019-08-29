"use strict";
exports.__esModule = true;
var Status;
(function (Status) {
    Status[Status["SUCCESS"] = 0] = "SUCCESS";
    Status[Status["SUCCESS_NO_CONTENT"] = 1] = "SUCCESS_NO_CONTENT";
    Status[Status["CREATED"] = 2] = "CREATED";
    Status[Status["FAILED_VALIDATION"] = 3] = "FAILED_VALIDATION";
    Status[Status["CONFLICT"] = 4] = "CONFLICT";
    Status[Status["NOT_FOUND"] = 5] = "NOT_FOUND";
    Status[Status["ERROR"] = 6] = "ERROR";
    Status[Status["UNPROCESSABLE_ENTRY"] = 7] = "UNPROCESSABLE_ENTRY";
    Status[Status["UNATHORIZED"] = 8] = "UNATHORIZED";
    Status[Status["PRECONDITION_FAILED"] = 9] = "PRECONDITION_FAILED";
})(Status = exports.Status || (exports.Status = {}));

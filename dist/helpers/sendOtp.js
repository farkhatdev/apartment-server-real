"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOtp = createOtp;
function createOtp() {
    return 100000 + Math.floor(Math.random() * 900000);
}

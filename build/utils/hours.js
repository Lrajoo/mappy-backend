"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOpeningHours = void 0;
const formatOpeningHours = (hours) => {
    const sundayHours = hours[6];
    let formattedHours = [...hours];
    formattedHours.pop();
    formattedHours.unshift(sundayHours);
    return formattedHours;
};
exports.formatOpeningHours = formatOpeningHours;

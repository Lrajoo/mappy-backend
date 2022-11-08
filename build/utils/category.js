"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategory = void 0;
const getCategory = (types) => {
    const category = [];
    if (types.includes("bar")) {
        category.push("bar");
    }
    else if (types.includes("cafe") || types.includes("bakery")) {
        category.push("coffee");
    }
    else if (types.includes("restaurant") || types.includes("food")) {
        category.push("restaurant");
    }
    return category;
};
exports.getCategory = getCategory;

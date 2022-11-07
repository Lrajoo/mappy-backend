export const getCategory = (types: string[]) => {
  const category = [];
  if (types.includes("bar")) {
    category.push("bar");
  } else if (types.includes("cafe") || types.includes("bakery")) {
    category.push("coffee");
  } else if (types.includes("restaurant") || types.includes("food")) {
    category.push("restaurant");
  }
  return category;
};

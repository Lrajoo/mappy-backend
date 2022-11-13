export const getCity = (searchQuery: string) => {
  const result = {
    query: "",
    city: "",
    state: "",
  };
  if (searchQuery.includes("New York City")) {
    result.city = "New York City".toLowerCase();
    result.state = "New York".toLowerCase();
    result.query = searchQuery.replace("New York City", "").trim().toLowerCase();
  }
  return result;
};

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
  if (searchQuery.includes("San Francisco")) {
    result.city = "San Francisco".toLowerCase();
    result.state = "California".toLowerCase();
    result.query = searchQuery.replace("San Francisco", "").trim().toLowerCase();
  }
  return result;
};

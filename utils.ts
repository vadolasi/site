export function classes(dynamic: { [key: string]: boolean }, classes = "") {
  return Object.entries(dynamic)
    .filter((entry) => entry[1])
    .map((entry) => entry[0])
    .join(" ")
    .concat(" ")
    .concat(classes)
}

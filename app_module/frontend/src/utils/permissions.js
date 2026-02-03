export function hasEditPermission() {
  const levels = JSON.parse(localStorage.getItem("user_level") || "[]");

  return levels.includes("admin") || levels.includes("editor");
}

const profileUrls = [
  "/profile/18.png",
  "/profile/gohan.png",
  "/profile/goku-s.png",
  "/profile/goku.png",
  "/profile/s-vegeta.png",
  "/profile/vegita.png",
  "/profile/vegito.png",
];
export const getRandomImageUrl = () => {
  return profileUrls[Math.floor(Math.random() * 7)];
};
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function formatTimestamp(ms: number) {
  const date = new Date(ms);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return (
      date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }) +
      ` ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    );
  }
}

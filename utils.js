const palette = {
  cc_orange: "#ff6f00",
  cc_black: "black",
  cc_blue: "#3e81c5",
  black: "black",
  white: "white",
};
export const theme = {
  colors: {
    primary: palette.cc_orange,
    secondary: palette.cc_blue,
    black: palette.black,
    white: palette.white,
    buttonColor: palette.cc_blue,
  },
};

function generateRandom36CharacterString() {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < 36; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }

  return randomString;
}

export { generateRandom36CharacterString };

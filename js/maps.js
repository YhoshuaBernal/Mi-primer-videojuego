const emojis = {
  "-": " ",
  O: "🚪",
  X: "💣",
  I: "🎁",
  PLAYER: "💀",
  BOMB_COLLISION: "🔥",
  GAME_OVER: "👎",
  WIN: "🏆",
  HEART: "❤️",
};

const maps = [];
maps.push(`
  IXXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  -XXXXXXXXX
  OXXXXXXXXX
`);
maps.push(`
  O--XXXXXXX
  X--XXXXXXX
  XX----XXXX
  X--XX-XXXX
  X-XXX--XXX
  X-XXXX-XXX
  XX--XX--XX
  XX--XXX-XX
  XXXX---IXX
  XXXXXXXXXX
  `);
maps.push(`
  I-----XXXX
  XXXXX-XXXX
  XX----XXXX
  XX-XXXXXXX
  XX-----XXX
  XXXXXX-XXX
  XX-----XXX
  XX-XXXXXXX
  XX-----OXX
  XXXXXXXXXX
`);
maps.push(`
----------
-X-XX-XXX-
-X----XXX-
-X-X-XXXX-
-X-----X--
-XXX---X-X
-X---X-X-X
-XX-X-X--X
IX-----OXX
XXXXXXXXXX
`);

const fs = require("fs");
const { fuzzyNode, goUpUntilFieldsFound } = require("./src/fuzzy-obj");
const _ = require("lodash");

const SEPARATOR = "|A|";
const SEPARATOR_END = "|Z|";

let sample = fs.readFileSync("samples/a.html").toString("utf-8");
scanSample(sample);

function scanSample() {
  console.time("rep");
  sample = sample
    .replace(/<script[^>]*>/gi, SEPARATOR)
    .replace("</script>", SEPARATOR_END);
  console.timeEnd("rep");

  console.time("extr");
  const extracted = sample
    .split(SEPARATOR)
    .map((i) => naiveTrim(i.split(SEPARATOR_END)[0]))
    .map((i) => {
      try {
        return JSON.parse(i);
      } catch (e) {}
    })
    .filter((i) => i);
  console.timeEnd("extr");

  console.time("fuz1");
  const root = fuzzyNode(extracted);

  const list = root.searchLeafPathsRegex(/playlist.*\].*videoId/i);
  console.timeEnd("fuz1");

  // console.log(list.map((l) => l.path));
  console.time("fuz2");

  let result = list.map((item) => {
    const spot = goUpUntilFieldsFound(item, ["videoId", "thumbnail", "title"]);
    // console.log(spot.path);

    return spot.flattenInto([
      "video",
      "thumbnail",
      "title",
      "length",
      "lengthSec",
      "playlist_id",
    ]);
  });

  console.timeEnd("fuz2");

  result = _.uniqBy(result, "video");
  console.log(result, result.length);
}

function naiveTrim(potentialJSON) {
  const result = potentialJSON.substring(potentialJSON.indexOf("{"));
  return result.substring(0, result.lastIndexOf("}") + 1);
}

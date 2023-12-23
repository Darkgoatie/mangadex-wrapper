# Documentation for mangadex-wrapper (by @darkgoatie)

## Information

This module supports the "GET" endpoints for mangadex.org api. It doesn't require authentication, and doesn't support authenticated features either. (yet.)

## Getting Help/Reporting Bugs

Theoretically, you can report bugs in the [github repository](https://github.com/Darkgoatie/mangadex-wrapper). However I am more active in discord. Join the <a href="https://discord.gg/Vmfe56uMf6" target="_blank">discord support server</a> instead. (I promise, no useless pings/notifications!)

## Links

- <a href="https://discord.gg/Vmfe56uMf6" target="_blank">Discord Server</a>
- <a href="https://github.com/Darkgoatie/Mangadex-api" target="_blank">Github</a>
- <a href="https://www.npmjs.com/package/@darkgoatie/mangadex-api" target="_blank">NPM</a>
- <a href="https://darkgoatie.github.io/mangadex-wrapper/">Full Documentation</a>

## Examples

### Get Manga by ID/Name

```js
const md = new Mangadex();
let result = await md.fetchMangaByID("c52b2ce3-7f95-469c-96b0-479524fb7a1a");
console.log(result.title.en); // -> "Jujutsu Kaisen"
```

### Get MangaID by name

```js
const md = new Mangadex();
const mangaID = (
  await md.fetchManga({
    title: "Vagabond",
  })
)[0].id;
console.log(mangaID); // -> "d1a9fdeb-f713-407f-960c-8326b586e6fd"
```

### Get Chapters of Manga

```js
const md = new Mangadex();
const manga = (
  await md.fetchManga({
    title: "Vagabond",
  })
)[0]; // -> Manga

const chapters = await manga.getMangaFeed({
  translatedLanguage: ["en"],
}); // -> Chapter[]

const chapterNames = chapters.map((ch) => {
  return ch.title;
}); // -> Chapter Names: ["Sudden Storm", "Takezo", "Purple Haze"]

const chapterIDs = chapters.map((ch) => {
  return ch.id;
}); // -> Chapter IDs: ["abcabc", "defdef", "ghighi"]

console.log(chapterNames); // -> ["Sudden Storm", "Takezo", "Purple Haze"]
```

### Get Reader Pages of a chapter

```js
/** Using same chapters object from previous example:
 *  chapters = Chapter[] */

const lowQualityPages = await chapters[0].getPages(true);
// -> returns array of low quality chapter page URLs (for data saving)

const standardPages = await chapters[0].getPages();
// -> returns array of standard quality chapter page URLs
```

### Get Chapters by name

```js
const md = new Mangadex();
let chapters = await md.fetchChapters({
  title: "Shinjuku Showdown",
  translatedLanguage: ["en"],
}); // -> Chapter[]

console.log(chapters[0].id); // -> ID of a chapter
```

I believe that these examples will be enough for you to grasp the general concept of the package. Feel free to check out the class members and properties to be informed about all features.

<iframe src="https://discord.com/widget?id=805802838630203433&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>

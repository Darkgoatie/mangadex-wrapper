const axios = require("axios");
const fs = require("fs");

/** 
 * @class 
 * @description Mangadex connection module constructor 
 * */
class Mangadex {
  /**
   * @param {Object} options
   * @param {Boolean} [options.fetchOne=false] Fetches only one manga.  Function returns a single Manga objectt if true.
   * @param {String} options.title Manga title to search for.
   * @returns {Manga[]|Manga} Returns a single manga/manga array depending on fetchOne option.
   */
  async fetchManga(options) {
    if (options === undefined) {
      throw new TypeError("Options undefined!");
    }

    let fetchOne;
    if (options.fetchOne === true) {
      fetchOne = true;
    } else {
      fetchOne = false;
    }

    if (typeof options.title !== "string") {
      throw new TypeError("Title should be string");
    }

    const resp = await axios({
      method: "GET",
      url: `${this.baseURL}/manga`,
      params: {
        title: options.title,
      },
    });

    let results = resp.data.data;

    if (fetchOne !== true) {
      return results.map(m => new Manga(m));
    } else {
      return new Manga(results[0]);
    }
  }


  /**
   * @param {String} baseURL Mangadex base API url. ("https://api.mangadex.org")
   */
  constructor() {
    this.baseURL = "https://api.mangadex.org";
  }
}

  /**
   * @class
   * @description Manga object. Only construct this via MangaDex class!
   */
class Manga {
  /**
   * @param {Object} order Sorting/Filtering parameters
   * @param {String} [order.translatedLanguage="en"] The language of the chapters to be imported. See example link for codes.
   * @example
   * Check https://api.mangadex.org/docs/3-enumerations/ for allowed order params
   * @returns {Chapter[]} Fetched chapters
   */
  async getChapters(order) {
    const finalOrderQuery = {};

    if (typeof order !== "object") order = {}

    for (const [key, value] of Object.entries(order)) {
      finalOrderQuery[`order[${key}]`] = value;
    }

    let resp = [];
    let req;
    for (let i = 0; true; i++) {
      req = await axios({
        method: "GET",
        url: `${this.baseURL}/manga/${this.id}/feed`,
        params: {
          limit: 100,
          offset: i * 100,
          ...finalOrderQuery,
        },
      });
      if (req.data.data.length === 0) break;
      resp = resp.concat(req.data.data);
    }
    return resp.map(c => new Chapter(c));
  }

  async getTotalPages() {
    let pages = 0;
    (await this.getChapters()).forEach(ch => {
      pages += ch.pages;
    });
    return pages;
  }
  /**
   * @constructor
   * @param {Object} mangadata Raw data from API
   */
  constructor(mangadata) {
    /**
     * @type {String} Base api URL ("https://api.mangadex.org")
     */
    this.baseURL = "https://api.mangadex.org";
    /**
     * @type {String} Manga title
     */
    this.title = mangadata.attributes.title.en;
    /**
     * @type {String} Manga api ID
     */
    this.id = mangadata.id;
    /**
     * @type {String} Type of content: "manga/comic"
     */
    this.type = mangadata.type;
    /**
     * @type
     */
    this.publicationDemographic;

    this.description = mangadata.attributes.description.en;
    this.status = mangadata.attributes.status;
  }
}

/** Chapter Object */
class Chapter {
  setMangaID(id) {
    this.mangaID = id;
  }

  async getPages() {
    const resp = await axios({
      method: "GET",
      url: "https://api.mangadex.org/at-home/server/" + this.id,
      params: {},
    });
    const pageids = resp.data.chapter.data;
    const baseURL = resp.data.baseUrl;
    const hash = resp.data.chapter.hash;
    return pageids.map(l => baseURL + "/data/" + hash + "/" + l);
  }

  /**
   * @constructor
   * @description Only construct this via MangaDex class!
   */
  constructor(chapterdata) {
    this.id = chapterdata.id;
    this.title = chapterdata.attributes.title;
    this.no = chapterdata.attributes.chapter;
    this.translatedLanguage = chapterdata.attributes.translatedLanguage;
    this.publishAt = chapterdata.attributes.publishAt;
    this.pages = chapterdata.attributes.pages;
  }
}

const run = async () => {
  const md = new Mangadex();
  const manga = (await md.fetchManga({ title: "Jujutsu Kaisen" }))[0];
  console.log(manga);
  const chapters = await manga.getChapters();
  console.log(chapters.length);
  fs.writeFileSync("pages.txt", (await chapters[15].getPages()).join("\n"));
  fs.writeFileSync("chapters.txt", chapters.map(c => c.no).join("\n"));
};

run();

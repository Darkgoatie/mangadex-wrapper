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
   * @param {Object} mangadata 
   * Raw data from API
   */
  constructor(mangadata) {
    /**
     * @typedef {Object} LocalizedString     
     * @property {String} language String by language code: "en", "ja" etc...
     */

    /**
     * @typedef {Object} Relationship
     * @property {String} id ID
     * @property {String} type 
     * @property {String} related Enum: "monochrome" "main_story" "adapted_from" "based_on" "prequel" "side_story" "doujinshi" "same_franchise" "shared_universe" "sequel" "spin_off" "alternate_story" "alternate_version" "preserialization" "colored" "serialization"
     */

    /**
     * Base api URL ("https://api.mangadex.org")
     * @type {String} 
     */
    this.baseURL = "https://api.mangadex.org";
    /**
     * Manga title for languages
     * @type {LocalizedString}
     */
    this.title = mangadata.attributes.title;
    /**
     * Manga api ID
     * @type {String} 
     */
    this.id = mangadata.id;
    /**
     * Value: "manga"
     * @type {String} 
     */
    this.type = mangadata.type;
    /**
     * Manga demographic: shounen, seinen etc...
     * @type {String} 
     */
    this.publicationDemographic;
    /**
     * Original language of manga: ja, en etc...
     * @type {String} 
     */
    this.originalLanguage = mangadata.attributes.originalLanguage;
    /**
     * Manga description 
     * @type {LocalizedString} 
     */
    this.description = mangadata.attributes.description;
    /**
     * Current manga status: "ongoing", "hiatus", "completed" or "canceled"
     * @type {String} 
     */
    this.status = mangadata.attributes.status;
    /**
     * Last released chapter of manga (Manga ID)
     * @type {String}
     */
    this.latestUploadedChapter = mangadata.attributes.latestUploadedChapter;
    /**
     * Manga release year
     * @type {Number}
     */
    this.year = mangadata.attributes.year;
    /**
     * Content rating of manga ("safe", "erotica", "suggestive" or "pornographic")
     * @type {String}
     */
    this.contentRating = mangadata.attributes.contentRating;
    /**
     * State of manga ("draft", "submitted", "published", "rejected")
     * @type {String}
     */
    this.state = mangadata.attributes.state 
    /**
     * Creation date
     * @type {String}
     */
    this.createdAt = mangadata.attributes.createdAt
    /**
     * Update date
     * @type {String}
     */
    this.updatedAt = mangadata.attributes.updatedAt
    /**
     * Version
     * @type {Number} 
     */
    this.version =  mangadata.attributes.version
    /**
     * @typedef {Object} MangaTag 
     * @property {String} id Tag ID
     * @property {String} type Value = "tag"
     * @property {TagAttributes} attributes Tag attributes
     * @property {Relationship[]} relationships Relationships
     */

    /**
     * @typedef {Object} TagAttributes
     * @property {LocalizedString} name Name
     * @property {LocalizedString} description Description
     * @property {String} group "content", "format", "genre", "theme"
     * @property {Number} version Integer >= 1
     */
    /**
     * Tags
     * @type {MangaTag[]}
     */
    this.tags =  mangadata.attributes.tags
  }
}

/** 
 * @class
 * @description Chapter object
 */
class Chapter {
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
 * @param {Object} chapterdata Raw API chapter data
 */
  constructor(chapterdata) {
    /**
     * Chapter api ID
     * @type {String}
     */
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
};

run();

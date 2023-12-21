const axios = require("axios");

/** 
 * @class 
 * @description Mangadex connection module constructor 
 * */
class Mangadex {
  /**
   * @param {String} authorId 
   * @returns {Author}
   */
  async fetchAuthorByID(authorId) {

  }

  /**
   * @typedef {Object} AuthorQuery 
   * @property {String} name Author's name
   * @property {Object} order Order parameters
   * @property {String[]} includes
   * @property {String[]} ids Author ids (Limited to 100 per request)
   */

  /**
   * @param {AuthorQuery} query 
   * @returns {Author[]}
   */
  async fetchAuthors(query) {
    const resp = await axios({
      method: "GET",
      url: this.baseURL + "/author",
      params: {
        ...query
      }
    });




  }
  /**
   * @typedef {("shounen"|"shoujo"|"josei"|"seinen"|"none")} publicationDemographic
   */

  /**
   * @typedef {("ongoing"|"hiatus"|"completed"|"cancelled")} mangaStatus
   */

  /**
   * @typedef {("safe"|"suggestive"|"erotica"|"pornographic")} contentRating
   */

  /**
   * @typedef {Object} MangaQuery
   * @property {String} title
   * @property {String} authorOrArtist Author/Artist ID
   * @property {String[]} authors
   * @property {String[]} artists
   * @property {Number} year
   * @property {String[]} includedTags
   * @property {String} [includedTagsMode="AND"] Avaliale values: AND, OR
   * @property {String[]} excludedTags
   * @property {String} [excludedTagsMode="OR"] Avaliable values: AND, OR
   * @property {mangaStatus[]} status Avaliable values: "ongoing", "completed", "hiatus", "cancelled"
   * @property {String[]} originalLanguage 
   * @property {String[]} excludedOriginalLanguage
   * @property {String[]} availableTranslatedLanguage
   * @property {publicationDemographic[]} publicationDemographic
   * @property {String[]} ids Manga ids (limited to 100 per request)
   * @property {contentRating[]} [contentRating=["safe", "suggestive", "erotica"]]
   * @property {String} createdAtSince
   * @property {String} updatedAtSince
   * @property {Object} order
   * @property {String} [order.latestUploadedChapter="desc"]
   * @property {String[]} includes Available values: "manga", "artist", "tag", "author", "creator", "cover_art"
   * @property {String} hasAvaliableChapters Available values: "0", "1", "true", "false"
   * @property {String} group Group ID
   */

  /**
   * @param {MangaQuery} query
   * @returns {Manga[]} Returns manga array
   */
  async fetchManga(query) {
    const resp = await axios({
      method: "GET",
      url: `${this.baseURL}/manga`,
      params: {
        ...query
      },
    });

    let results = resp.data.data;

    return results.map(m => new Manga(m));
  }

  /**
   * @param {String} mangaId
   * @returns {Manga}
   */
  async fetchMangaByID(mangaId) {
    const resp = await axios({
      method: "GET",
      url: this.baseURL + "/manga/" + mangaId,
      params: {id: mangaId}
    });

    return new Manga(resp.data.data);
  }

  constructor() {
    /**
     * base api url
     * @type {"https://api.mangadex.org"}
     */
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
   * @example Check https://api.mangadex.org/docs/3-enumerations/ for allowed order params
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
     * @type {"https://api.mangadex.org"} 
     */
    this.baseURL = "https://api.mangadex.org";
    /**
     * Manga title for languages
     * @type {LocalizedString}
     */
    if(!mangadata.attributes) {
      mangadata.attributes = mangadata
    };

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
     * Current manga status
     * @type {mangaStatus} 
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
    if(!chapterdata.attributes) chapterdata.attributes = chapterdata;
    /**
     * Volume that the chapter belongs to
     * @type {String} 
     */
    this.volume = chapterdata.attributes.volume
    /**
     * Chapter api ID
     * @type {String}
     */
    this.id = chapterdata.id;
    /**
     * Title
     * @type {String}
     */
    this.title = chapterdata.attributes.title;
    /**
     * @type {Number}
     */
    this.chapter = chapterdata.attributes.chapter;
    /**
     * @type {String} 
     */
    this.translatedLanguage = chapterdata.attributes.translatedLanguage;
    /**
     * @type {String}
     */
    this.publishAt = chapterdata.attributes.publishAt;
    /**
     * Number of pages
     * @type {Number}
     */
    this.pages = chapterdata.attributes.pages;
    /**
     * @type {"chapter"}
     */
    this.type = chapterdata.type
    /**
     * @type {String}
     */
    this.uploader = chapterdata.attributes.uploader;
    /**
     * @type {Number}
     */
    this.version = chapterdata.attributes.version
    /**
     * @type {String} 
     */
    this.readableAt = chapterdata.attributes.readableAt
    /**
     * @type {String}
     */
    this.updatedAt = chapterdata.attributes.updatedAt
    /**
     * @type {String}
     */
    this.createdAt = chapterdata.attributes.createdAt
    /**
     * @type {Relationship[]}
     */
    this.relationships = chapterdata.relationships
  }
}

const run = async () => {
  const md = new Mangadex();
  const manga = new Manga((await md.fetchMangaByID()))
};

run();

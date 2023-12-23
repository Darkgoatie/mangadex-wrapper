const { default: axios } = require("axios");

/**
 * @class
 * @description Chapter object
 */
class Chapter {
  /**
   * @constructor
   * @param {Object} chapterdata Raw API chapter data
   */
  constructor(chapterdata) {
    if (!chapterdata.attributes) chapterdata.attributes = chapterdata;
    /**
     * Volume that the chapter belongs to
     * @type {String}
     */
    this.volume = chapterdata.attributes.volume;
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
    this.type = chapterdata.type;
    /**
     * @type {String}
     */
    this.uploader = chapterdata.attributes.uploader;
    /**
     * @type {Number}
     */
    this.version = chapterdata.attributes.version;
    /**
     * @type {String}
     */
    this.readableAt = chapterdata.attributes.readableAt;
    /**
     * @type {String}
     */
    this.updatedAt = chapterdata.attributes.updatedAt;
    /**
     * @type {String}
     */
    this.createdAt = chapterdata.attributes.createdAt;
    /**
     * @type {Relationship[]}
     */
    this.relationships = chapterdata.relationships;
  }
  /**
   * @param {Boolean} [dataSaver=false] Returns low quality images for saving data
   * @returns {Promise<String[]>} Page URLs (Images)
   */
  async getPages(dataSaver) {
    const resp = await axios({
      method: "GET",
      url: "https://api.mangadex.org/at-home/server/" + this.id,
    });
    const baseURL = resp.data.baseUrl;
    const hash = resp.data.chapter.hash;
    if (dataSaver === true) {
      const pageids = resp.data.chapter.dataSaver;
      return pageids.map((l) => {
        return baseURL + "/data-saver/" + hash + "/" + l;
      });
    } else {
      const pageids = resp.data.chapter.data;
      return pageids.map((l) => {
        return baseURL + "/data/" + hash + "/" + l;
      });
    }
  }
  /**
   * @returns {String | null} Manga UUID
   */
  getManga() {
    const mangaRelations = this.relationships.find((rel) => {
      rel.type === "manga";
    });
    if (!mangaRelations) return null;
    return mangaRelations.id;
  }
  /**
   * @returns {Promise<CoverArt> | null}
   */
  async getCoverArt() {
    const Mangadex = require("./MangaDex");
    const id = this.getManga();
    if (!id) return null;
    return new Mangadex().fetchCoverArtByID(id);
  }

  /**
   * @descriptionGet human-accessible url to this. (Mangadex.org link)
   * @returns {String} URL
   */
  getHumanURL() {
    return `https://mangadex.org/chapter/${this.id}`;
  }
}

module.exports = Chapter;

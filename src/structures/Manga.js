/**
 * @class
 * @description Manga object. Only construct this via MangaDex class!
 */
class Manga {
  /**
   * @constructor
   * @param {Object} mangadata Raw API author data
   */
  constructor(mangadata) {
    if (!mangadata.attributes) {
      mangadata.attributes = mangadata;
    }

    /**
     * @type {Relationship[]}
     */
    this.relationships = mangadata.relationships;
    /**
     * Base api URL ("https://api.mangadex.org")
     * @type {"https://api.mangadex.org"}
     */
    this.baseURL = "https://api.mangadex.org";
    /**
     * Manga api ID
     * @type {String}
     */
    this.id = mangadata.id;
    /**
     * @type {"manga"}
     */
    this.type = mangadata.type;
    /**
     * Manga title for languages
     * @type {LocalizedString}
     */
    this.title = mangadata.attributes.title;
    /**
     * @type {LocalizedString[]}
     */
    this.altTitles = mangadata.attributes.altTitles;
    /**
     * Manga description
     * @type {LocalizedString}
     */
    this.description = mangadata.attributes.description;
    /**
     * @type {Boolean}
     */
    this.isLocked = mangadata.attributes.isLocked;
    /**
     * @type {Object}
     */
    this.links = mangadata.attributes.links;
    /**
     * Original language of manga: ja, en etc...
     * @type {String}
     */
    this.originalLanguage = mangadata.attributes.originalLanguage;
    /**
     * @type {String}
     */
    this.lastChapter = mangadata.attributes.lastChapter;
    /**
     * @type {String}
     */
    this.lastVolume = mangadata.attributes.lastVolume;
    /**
     * @type {publicationDemographic}
     */
    this.publicationDemographic = mangadata.attributes.publicationDemographic;
    /**
     * @type {mangaStatus}
     */
    this.status = mangadata.attributes.status;
    /**
     * @type {Number}
     */
    this.year = mangadata.attributes.year;
    /**
     * @type {contentRating}
     */
    this.contentRating = mangadata.attributes.contentRating;
    /**
     * Tags
     * @type {MangaTag[]}
     */
    this.tags = mangadata.attributes.tags;
    /**
     * @type {mangaState}
     */
    this.state = mangadata.attributes.state;
    /**
     * @type {String}
     */
    this.createdAt = mangadata.attributes.createdAt;
    /**
     * @type {String}
     */
    this.updatedAt = mangadata.attributes.updatedAt;
    /**
     * @type {Boolean}
     */
    this.chapterNumbersResetOnNewVolume =
      mangadata.attributes.chapterNumbersResetOnNewVolume;
    /**
     * @type {LanguageCode[]}
     */
    this.availableTranslatedLanguages =
      mangadata.attributes.availableTranslatedLanguages;
    /** Chapter UUID
     * @type {String}
     */
    this.latestUploadedChapter = mangadata.attributes.latestUploadedChapter;
  }

  /**
   * @deprecated Use getMangaFeed instead. I might remove this soon.
   * @param {MangaFeedQuery} query
   * @returns {Promise<Chapter[]>} Fetched chapters
   */
  async getChapters(query) {
    const offsetRequest = require("../functions/offsetRequest");
    const Chapter = require("./Chapter");
    const resp = await offsetRequest({
      url: `${this.baseURL}/manga/${this.id}/feed`,
      ...query,
    });
    return resp.map((c) => new Chapter(c));
  }

  /**
   * @param {MangaFeedQuery} Query
   * @returns {Promise<Chapter[]>}
   */
  async getMangaFeed(Query) {
    const offsetRequest = require("../functions/offsetRequest");
    const Chapter = require("./Chapter");
    const res = await offsetRequest({
      url: this.baseURL + "/manga/" + this.id + "/feed",
      ...Query,
    });
    return res.map((cdata) => {
      return new Chapter(cdata);
    });
  }

  /**
   * @returns {String} Author UUID
   */
  getAuthor() {
    const AuthorRelation = this.relationships.find(
      (rel) => rel.type === "author"
    );
    return AuthorRelation.id;
  }
  /**
   * @returns {String} Cover UUID
   */
  getCoverArt() {
    const CoverArtRelation = this.relationships.find(
      (rel) => rel.type === "cover_art"
    );
    return CoverArtRelation.id;
  }
  /**
   * @returns {String} Artist UUID
   */
  getArtist() {
    const ArtistRelation = this.relationships.find(
      (rel) => rel.type === "artist"
    );
    return ArtistRelation.id;
  }
  /**
   * @deprecated Not needed, gets multiple sources from different langs
   * @returns {Promise<Number>}
   */
  async getTotalPages() {
    let pages = 0;
    (await this.getMangaFeed()).forEach((ch) => {
      pages += ch.pages;
    });
    return pages;
  }
  /**
   * @descriptionGet human-accessible url to this. (Mangadex.org link)
   * @returns {String} URL
   */
  getHumanURL() {
    return `https://mangadex.org/title/${this.id}/${this.title.en}`;
  }
  /**
   * @param {MangaAggregateQuery} Query
   * @returns {Promise<Object.<String, AggregatedVolume>>}
   * @example
   * let res = await MangaObject.aggregate()
   * console.log(res) # -> {"1": AggregatedVolume, "2": AggregatedVolume }
   */
  async aggregate(Query) {
    const axios = require("axios");
    const req = await axios({
      method: "GET",
      url: this.baseURL + "/manga/" + this.id + "/aggregate",
      params: { ...Query },
    });
    return req.data.volumes;
  }
}

module.exports = Manga;

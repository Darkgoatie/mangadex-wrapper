/**
 * @class
 * @description Mangadex connection module constructor
 * */
class Mangadex {
  /**
   * @param {String} coverArtID CoverArt or Manga UUID
   * @returns {Promise<CoverArt>}
   */
  async fetchCoverArtByID(coverArtID) {
    const offsetRequest = require("../functions/offsetRequest");
    const CoverArt = require("./CoverArt");
    const resp = await offsetRequest({
      url: this.baseURL + "/cover/" + coverArtID,
    });
    return new CoverArt(resp);
  }

  /**
   * @param {CoverArtQuery} Query
   * @returns {Promise<CoverArt[]>}
   */
  async fetchCoverArts(Query) {
    const offsetRequest = require("../functions/offsetRequest");
    const CoverArt = require("./CoverArt");
    const resp = await offsetRequest({
      url: this.baseURL + "/cover",
      ...Query,
    });
    return resp.map((a) => {
      return new CoverArt(a);
    });
  }

  /**
   * @param {String} authorID
   * @returns {Promise<Author>}
   */
  async fetchAuthorByID(authorID) {
    const offsetRequest = require("../functions/offsetRequest");
    const Author = require("./Author");
    const resp = await offsetRequest({
      url: this.baseURL + "/author/" + authorID,
    });
    return new Author(resp);
  }

  /**
   * @param {AuthorQuery} query
   * @returns {Promise<Author[]>}
   */
  async fetchAuthors(query) {
    const offsetRequest = require("../functions/offsetRequest");
    const Author = require("./Author");
    const resp = await offsetRequest({
      url: this.baseURL + "/author",
      ...query,
    });
    return resp.map((a) => {
      return new Author(a);
    });
  }

  /**
   * @param {ChapterQuery} query
   * @returns {Promise<Chapter[]>}
   */
  async fetchChapters(query) {
    const offsetRequest = require("../functions/offsetRequest");
    const Chapter = require("./Chapter");
    const resp = await offsetRequest({
      url: this.baseURL + "/chapter",
      ...query,
    });

    return resp.map((c) => {
      return new Chapter(c);
    });
  }
  /**
   *
   * @param {String} chapterID
   * @returns {Promise<Chapter>}
   */
  async fetchChapterByID(chapterID) {
    const offsetRequest = require("../functions/offsetRequest");
    const Chapter = require("./Chapter");
    const resp = await offsetRequest({
      url: this.baseURL + "/chapter/" + chapterID,
    });
    return new Chapter(resp);
  }

  /**
   * @param {MangaQuery} query
   * @returns {Promise<Manga[]>} Returns manga array
   */
  async fetchManga(query) {
    const offsetRequest = require("../functions/offsetRequest");
    const Manga = require("./Manga");
    const resp = await offsetRequest({
      url: this.baseURL + "/manga",
      ...query,
    });

    return resp.map((mdata) => {
      return new Manga(mdata);
    });
  }

  /**
   * @param {String} mangaId
   * @returns {Promise<Manga>}
   */
  async fetchMangaByID(mangaId) {
    const offsetRequest = require("../functions/offsetRequest");
    const Manga = require("./Manga");
    const resp = await offsetRequest({
      url: this.baseURL + "/manga/" + mangaId,
    });
    return new Manga(resp);
  }

  /**
   * @param {String} MangaID Manga UUID
   * @param {MangaAggregateQuery} Query
   * @returns {Promise<Object.<String, AggregatedVolume>>}
   */
  async aggregateMangaByID(MangaID, Query) {
    const axios = require("axios");
    const req = await axios({
      method: "GET",
      url: this.baseURL + "/manga/" + MangaID + "/aggregate",
      params: { ...Query },
    });
    return req.data.volumes;
  }

  constructor() {
    /**
     * base api url
     * @type {"https://api.mangadex.org"}
     */
    this.baseURL = "https://api.mangadex.org";
  }
}

module.exports = Mangadex;

/**
 * @class CoverArt Constructor
 */
class CoverArt {
  /**
   * @param {Object} coverdata Raw API cover data
   */
  constructor(coverdata) {
    /** Cover UUID
     * @type {String}
     */
    this.id = coverdata.id;
    /**
     * @type {"cover_art"}
     */
    this.type = coverdata.type;
    /**
     * @type {String}
     */
    this.volume = coverdata.attributes.volume;
    /**
     * @type {String}
     */
    this.fileName = coverdata.attributes.fileName;
    /**
     * @type {String}
     */
    this.description = coverdata.attributes.description;
    /**
     * @type {LanguageCode}
     */
    this.locale = coverdata.attributes.locale;
    /**
     * @type {Number}
     */
    this.version = coverdata.attributes.version;
    /**
     * @type {String}
     */
    this.createdAt = coverdata.attributes.createdAt;
    /**
     * @type {String}
     */
    this.updatedAt = coverdata.attributes.updatedAt;
    /**
     * @type {Relationship[]}
     */
    this.relationships = coverdata.relationships;
  }
  /**
   * @returns {String} Image URL
   */
  getImageUrl() {
    return (
      "https://uploads.mangadex.org/covers/" +
      this.getManga() +
      "/" +
      this.fileName
    );
  }
  /**
   *
   * @returns {String} Manga UUID
   */
  getManga() {
    return this.relationships.find((rel) => {
      return rel.type === "manga";
    }).id;
  }
}

module.exports = CoverArt;

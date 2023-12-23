/**
 * @class
 * @description Author object
 */
class Author {
  /**
   * @param {Object} authordata Raw API author data
   */
  constructor(authordata) {
    /**
     * @type {String}
     */
    this.id = authordata.id;
    /**
     * @type {String}
     */
    this.type = authordata.author;
    /**
     * @type {String}
     */
    this.name = authordata.attributes.name;
    /**
     * @type {String|null}
     */
    this.imageUrl = authordata.attributes.imageUrl;
    /**
     * @type {LocalizedString}
     */
    this.biography = authordata.attributes.biography;
    /**
     * @type {String|null}
     */
    this.twitter = authordata.attributes.twitter;
    /**
     * @type {String|null}
     */
    this.pixiv = authordata.attributes.twitter;
    /**
     * @type {String|null}
     */
    this.melonBook = authordata.attributes.twitter;
    /**
     * @type {String|null}
     */
    this.fanBox = authordata.attributes.twitter;
    /**
     * @type {String|null}
     */
    this.booth = authordata.attributes.booth;
    /**
     * @type {String|null}
     */
    this.nicoVideo = authordata.attributes.nicoViedo;
    /**
     * @type {String|null}
     */
    this.skeb = authordata.attributes.fantia;
    /**
     * @type {String|null}
     */
    this.tumblr = authordata.attributes.tumblr;
    /**
     * @type {String|null}
     */
    this.youtube = authordata.attributes.youtube;
    /**
     * @type {String|null}
     */
    this.weibo = authordata.attributes.weibo;
    /**
     * @type {String|null}
     */
    this.naver = authordata.attributes.naver;
    /**
     * @type {String|null}
     */
    this.website = authordata.attributes.website;
    /**
     * @type {String}
     */
    this.createdAt = authordata.attributes.createdAt;
    /**
     * @type {String}
     */
    this.updatedAt = authordata.attributes.updatedAt;
    /**
     * @type {Number}
     */
    this.version = authordata.attributes.version;
    /**
     * @type {Relationship[]}
     */
    this.relationships = authordata.relationships;
  }

  /**
   * @returns {String[]} Manga UUIDs
   *
   */
  getMangas() {
    return this.relationships
      .filter((rel) => {
        return rel.type === "manga";
      })
      .map((rel) => {
        return rel.id;
      });
  }

  /**
   * @description Get human-accessible url to this. (Mangadex.org link)
   * @returns {String} URL
   * @example
   * Author.getHumanURL() # Returns "https://mangadex.org/author/94be1d47-54d0-42c6-b42b-439605e3793f/akutami-gege"
   */
  getHumanURL() {
    return `https://mangadex.org/author/${this.id}/${this.name}`;
  }
}

module.exports = Author;

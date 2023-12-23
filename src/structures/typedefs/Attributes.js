/**
 * @typedef {Object} Relationship
 * @prop {String} id ID
 * @prop {String} type
 * @prop {String} related Enum: "monochrome" "main_story" "adapted_from" "based_on" "prequel" "side_story" "doujinshi" "same_franchise" "shared_universe" "sequel" "spin_off" "alternate_story" "alternate_version" "preserialization" "colored" "serialization" "author" "cover" "artist"
 * @prop {Object} attributes
 */

/**
 * @typedef {Object} MangaTag
 * @prop {String} id Tag ID
 * @prop {String} type Value = "tag"
 * @prop {TagAttributes} attributes Tag attributes
 * @prop {Relationship[]} relationships Relationships
 */

/**
 * @typedef {Object} TagAttributes
 * @prop {LocalizedString} name Name
 * @prop {LocalizedString} description Description
 * @prop {String} group "content", "format", "genre", "theme"
 * @prop {Number} version Integer >= 1
 */

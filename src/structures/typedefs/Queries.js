/**
 * @global
 * @typedef {Object} MangaOrderOptions
 * @prop {("asc"|"desc")} [title]
 * @prop {("asc"|"desc")} [year]
 * @prop {("asc"|"desc")} [createdAt]
 * @prop {("asc"|"desc")} [updatedAt]
 * @prop {("asc"|"desc")} [latestUploadedChapter="desc"]
 * @prop {("asc"|"desc")} [followedCount]
 * @prop {("asc"|"desc")} [relevance]
 */

/**
 * @global
 * @typedef {Object} MangaQuery
 * @prop {String} [title]
 * @prop {String} [authorOrArtist] Author/Artist ID
 * @prop {String[]} [authors]
 * @prop {String[]} [artists]
 * @prop {Number} [year]
 * @prop {String[]} [includedTags]
 * @prop {String} [includedTagsMode="AND"] Avaliale values: AND, OR
 * @prop {String[]} [excludedTags]
 * @prop {String} [excludedTagsMode="OR"] Avaliable values: AND, OR
 * @prop {mangaStatus[]} [status] Avaliable values: "ongoing", "completed", "hiatus", "cancelled"
 * @prop {String[]} [originalLanguage]
 * @prop {String[]} [excludedOriginalLanguage]
 * @prop {String[]} [availableTranslatedLanguage]
 * @prop {publicationDemographic[]} [publicationDemographic]
 * @prop {String[]} [ids] Manga ids (limited to 100 per request)
 * @prop {contentRating[]} [contentRating=["safe", "suggestive", "erotica"]]
 * @prop {String} [createdAtSince]
 * @prop {String} [updatedAtSince]
 * @prop {MangaOrderOptions} [order]
 * @prop {String[]} [includes] Available values: "manga", "artist", "tag", "author", "creator", "cover_art"
 * @prop {String} [hasAvaliableChapters] Available values: "0", "1", "true", "false"
 * @prop {String} [group] Group ID
 */

/**
 * @global
 * @typedef {Object} MangaFeedQuery
 * @prop {String[]} [translatedLanguage]
 * @prop {String[]} [originalLanguage]
 * @prop {String[]} [excludedOriginalLanguage]
 * @prop {contentRating[]} [contentRating]
 * @prop {String[]} [excludedGroups]
 * @prop {String[]} [excludedUploaders]
 * @prop {("1"|"0")} [includeFutureUpdates=1]
 * @prop {String} [createdAtSince]
 * @prop {String} [updatedAtSince]
 * @prop {String} [publishAtSince]
 * @prop {MangaOrderOptions} [order]
 * @prop {String[]} [includes]
 * @prop {(0|1)} [includeEmptyPages]
 * @prop {(0|1)} [includeFuturePublishAt]
 * @prop {(0|1)} [includeExternalUrl]
 */

/**
 * @global
 * @typedef {Object} MangaAggregateQuery
 * @prop {LanguageCode[]} translatedLanguage
 * @prop {String[]} groups Group UUIDs
 */

/**
 * @global
 * @typedef {Object} AggregatedVolume
 * @prop {String} volume
 * @prop {Number} count
 * @prop {Object.<String, AggregatedChapter>} chapters
 * @example
 * AggregatedVolume.chapters["1"] # Returns {AggregatedChapter} with code "1"
 */

/**
 * @global
 * @typedef {Object} AggregatedChapter
 * @prop {String} chapter Chapter number
 * @prop {String} id Chapter UUID
 * @prop {String[]} others
 * @prop {Number} count
 */

/**
 * @global
 * @typedef {Object} ChapterOrderOptions
 * @prop {("asc"|"desc")} [createdAt="asc"]
 * @prop {("asc"|"desc")} [updatedAt="asc"]
 * @prop {("asc"|"desc")} [publishAt="asc"]
 * @prop {("asc"|"desc")} [readableAt="asc"]
 * @prop {("asc"|"desc")} [volume="asc"]
 * @prop {("asc"|"desc")} [chapter="asc"]
 */

/**
 * @global
 * @typedef {Object} ChapterQuery
 * @prop {String[]} ids Limited to 100
 * @prop {String} [title]
 * @prop {String[]} [groups]
 * @prop {String[]} [uploader] Uploader UUIDs
 * @prop {String} [manga] Manga UUID
 * @prop {String[]|String} [volume]
 * @prop {String[]} [chapter]
 * @prop {String[]} [translatedLanguage]
 * @prop {String[]} [originalLanguage]
 * @prop {String[]} [excludedOriginalLanguage]
 * @prop {contentRating[]} [contentRating=["safe","suggestive","erotica"]]
 * @prop {String[]} [excludedGroups]
 * @prop {String[]} [excludedUploaders]
 * @prop {("1"|"0")} [includeFutureUpdates="1"]
 * @prop {(1|0)} [includeEmptyPages]
 * @prop {(1|0)} [includeFuturePublishAt]
 * @prop {(1|0)} [includeExternalUrl]
 * @prop {String} [createdAtSince]
 * @prop {String} [updatedAtSince]
 * @prop {String} [publishAtSince]
 * @prop {ChapterOrderOptions} [order]
 * @prop {String[]} [includes] Available values : manga, scanlation_group, user
 */

/**
 * @global
 * @typedef {Object} AuthorQuery
 * @prop {String} [name] Author's name
 * @prop {AuthorOrderOptions} [order] Order parameters
 * @prop {String[]} [includes]
 * @prop {String[]} [ids] Author ids (Limited to 100 per request)
 */

/**
 * @global
 * @typedef {Object} AuthorOrderOptions
 * @prop {("asc"|"desc")} name
 */

/**
 * @global
 * @typedef {Object} CoverArtQuery
 * @prop {String[]} manga Manga ids (limited to 100 per request)
 * @prop {String[]} ids Covers ids (limited to 100 per request)
 * @prop {String[]} uploaders User ids (limited to 100 per request)
 * @prop {String[]} locales Locales of cover art (limited to 100 per request)
 * @prop {CoverArtOrder} order
 * @prop {String[]} includes
 */

/**
 * @global
 * @typedef {Object} CoverArtOrder
 * @prop {"asc"|"desc"} createdAt
 * @prop {"asc"|"desc"} updatedAt
 * @prop {"asc"|"desc"} volume
 */

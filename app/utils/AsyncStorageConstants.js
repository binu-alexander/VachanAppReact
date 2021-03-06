module.exports = {
    Keys: {
        ColorMode : 'color_mode',
        SizeMode: 'size_mode',
        VerseViewMode:'verse_view_mode',
        LastReadReference:'last_read_reference',
        LanguageCode:'language_code',
        VersionCode:'version_code',
        LanguageName:'language_name',
        VersionName:'version_name',
        BookId:'book_id',
        BookName:'book_name',
        BackupRestoreEmail:'backup_restore_email',
        ChapterNumber:"chapter_number"

    },
    Values: {
        DayMode: 1,
        NightMode: 0,

        SizeModeXSmall: 0,
        SizeModeSmall: 1,
        SizeModeNormal: 2,
        SizeModeLarge: 3,
        SizeModeXLarge: 4,

        VerseInLine:false,

        LastReadReference: {
            languageCode:'ENG',
            versionCode:'ULT',
            bookId:'GEN',
            chapterNumber:1,
        },

        DefLanguageCode:'ENG',
        DefLanguageName:'English',
        DefVersionCode:'ULT',
        DefVersionName:'unfoldingWord Literal Text',
        DefBookId:'GEN',
        DefBookName:'Genesis',
        DefBookChapter:1

       
    }
}




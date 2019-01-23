This is an hard fork from [i18n-transcoder](https://github.com/biesbjerg/i18n-transcoder) 

# i18n-transcoder
Extract translatable strings and save if for translators-handy format:

* PO / POT gettext file format
* JSON - flat and tree-like structure
* XLIFF 1.2 and XLIFF 2 file formats

Merges with existing strings if the output file already exists.

## Usage
Install the package in your project:

`npm install @eemoss/i18n-transcoder --save-dev`

Add an `extract` script to your project's `package.json`:
```
"scripts": {
  "extract": "i18n-transcoder --input ./src --output ./src/assets/i18n/ --clean --sort --format namespaced-json"
}
```
You can now run `npm run extract` to extract strings.

## Extract examples

**Extract from dir and save to file**

`i18n-transcoder -i ./src -o ./src/i18n/strings.json`

**Extract from multiple dirs**

`i18n-transcoder -i ./src/folder-a ./src/folder-b -o ./src/i18n/strings.json`

**Extract and save to multiple files**

`i18n-transcoder -i ./src -o ./src/i18n/{da,en,fr}.json`

**or**

`i18n-transcoder -i ./src -o ./src/i18n/da.json ./src/i18n/en.json ./src/i18n/fr.json`

**or (update only)**

`i18n-transcoder -i ./src -o ./src/i18n/*.json`

**or (update only)**

## Custom indentation
By default, spaces are used for indentation when writing extracted strings to json formats:

`i18n-transcoder -i ./src -o ./src/i18n/en.json --format-indentation '  '`

If you want to use tabs instead, you can do the following:

`i18n-transcoder -i ./src -o ./src/i18n/en.json --format-indentation $'\t'`

## Marking strings for extraction

i18n-transcoder search your code for i18n services calls:

* Any usage of `TranslateService.translate` and `TranslateService.translateSync` functions in you code, called with inline strings (e.g. `TranslateService.translateSync("my.custom.id", "Suggested EN translation", "Note for translator")`).
* Any usage of `$i18n()` marker function in you code, called with inline strings (e.g. `$i18n("my.custom.id", "EN translation", "Note for translator")`). Note that this function will not return translation - it's for marking only.
* Any usage of `translate` or `translateSync` pipe with inline strings. E.g. `{{"my.custom.id" | translate:"EN Translation":"Note for translator"}}`.
* Entire content of all `.json` files with structure like:
```json
{
  "my": {
    "custom": {
      "id": {
        "suggestedTranslation": "Suggested EN translation",
        "note": "Note for translator"
      },
      "id2": {
      	"suggestedTranslation": "Translation 2"
      },
      "id3": {
        "suggestedTranslation": "Translation 3"
      }
    }
  }
}
```

## Mark strings for extraction using different marker function

If, for some reason, you want to use a custom marker function add the `marker` argument when running the extract script:

`i18n-transcoder ... -m _`

To use function `_(...)` as marker function

## Commandline arguments
``` text
Usage:
i18n-transcoder [options]

Options:
  --version, -v               Show version number                      [boolean]
  --help, -h                  Show help                                [boolean]
  --input, -i                 Paths you would like to extract strings from. You
                              can use path expansion, glob patterns and multiple
                              paths      [array] [default: current working path]
  --patterns, -p              Extract strings from the following file patterns
                       [array] [default: ["/**/*.html","/**/*.ts","/**/*.json"]]
  --output, -o                Paths where you would like to save extracted
                              strings. You can use path expansion, glob patterns
                              and multiple paths              [array] [required]
  --marker, -m                Extract strings passed to a marker function
                                                       [string] [default: false]
  --format, -f                Output format
         [string] [choices: "json", "namespaced-json", "pot", "xliff", "xliff2"]
                                                               [default: "json"]
  --format-indentation, --fi  Output format indentation [string] [default: "  "]
  --replace, -r               Replace the contents of output file if it exists
                              (Merges by default)     [boolean] [default: false]
  --sort, -s                  Sort strings in alphabetical order when saving
                                                      [boolean] [default: false]
  --clean, -c                 Remove obsolete strings when merging
                                                      [boolean] [default: false]
  --verbose, --vb             Log all output to console[boolean] [default: true]
```

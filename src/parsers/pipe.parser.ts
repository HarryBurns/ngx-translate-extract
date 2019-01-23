import { ParserInterface } from './parser.interface';
import { AbstractTemplateParser } from './abstract-template.parser';
import { TranslationCollection } from '../utils/translation.collection';

export class PipeParser extends AbstractTemplateParser implements ParserInterface {

	public extract(contents: string, path?: string): TranslationCollection {
		if (path && this._isAngularComponent(path)) {
			contents = this._extractInlineTemplate(contents);
		}

		return this._parseTemplate(contents);
	}

	protected _parseTemplate(template: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		// Haha, try to debug this!
		const regExp: RegExp = /((?<![\\])[`'"])((?:.(?!(?<![\\])\1))*.?)\1\s*\|\s*(?:(?:translate)|(?:translateSync))(?:\s*:\s*((?<![\\])[`'"])((?:.(?!(?<![\\])\3))*.?)\3\s*)?(?::\s*((?<![\\])[`'"])((?:.(?!(?<![\\])\5))*.?)\5)?/g;

		let matches: RegExpExecArray;
		while (matches = regExp.exec(template)) {
			const id = matches[2] ? this._compileString(matches[1], matches[2]) : void 0;
			const enTranslation = matches[4] ? this._compileString(matches[3], matches[4]) : void 0;
			const note = matches[6] ? this._compileString(matches[5], matches[6]) : void 0;
			collection.add(id, enTranslation, note);
		}

		return collection;
	}

	/**
	 * Compile java script string from source code
	 */
	protected _compileString(quoteSign: string, str: string): string {
		let compileFunc = new Function(`return ${quoteSign}${str}${quoteSign}`);
		try {
			return compileFunc();
		} catch (e) {
			console.log('WARNING: unable to parse extracted string: ' + str);
			return str; // return original string, let the user suffer for his own bugs
		}
	}

}

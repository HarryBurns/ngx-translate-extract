import { CompilerInterface } from './compiler.interface';
import { TranslationCollection, TranslationInfo } from '../utils/translation.collection';

import * as gettext from 'gettext-parser';

/**
 * PO / POT gettext format compiler.
 * @see https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html
 */
export class PoCompiler implements CompilerInterface {

	public extension = 'po';

	/**
	 * Translation domain
	 */
	public domain = '';

	public constructor(options?: any) {
	}

	public compile(collection: TranslationCollection): string {
		const data = {
			charset: 'utf-8',
			headers: {
				'mime-version': '1.0',
				'content-type': 'text/plain; charset=utf-8',
				'content-transfer-encoding': '8bit'
			},
			translations: {
				[this.domain]: collection.values.reduce((translations, translationInfo) => {
					translations[translationInfo.id] = {
						msgid: translationInfo.id,
						msgstr: translationInfo.suggestedTranslation,
						comments: {
							extracted: translationInfo.note
						}
					};
					return translations;
				}, <any> {})
			}
		};

		return gettext.po.compile(data, 'utf-8');
	}

	public parse(contents: string): TranslationCollection {
		const collection = new TranslationCollection();

		const po = gettext.po.parse(contents, 'utf-8');
		if (!po.translations.hasOwnProperty(this.domain)) {
			return collection;
		}

		const values = Object.keys(po.translations[this.domain])
			.filter(id => id.length > 0)
			.reduce((values, id) => {
				let translation = po.translations[this.domain][id];
				values.push({
					id: translation.msgid,
					suggestedTranslation: translation.msgstr.pop(),
					note: translation.comments.extracted
				});
				return values;
			}, <TranslationInfo[]> []);

		return new TranslationCollection(values);
	}

}

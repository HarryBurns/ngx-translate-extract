import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';

const xliff = require('xliff');

/**
 * XLIFF 2.0+ format compiler
 * @see http://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html#fragid-example
 */
export class Xliff2Compiler implements CompilerInterface {

	public extension = 'xliff2'; // or xlf2

	public xliffFileId = 'ppc';

	public constructor(options?: any) {

	}

	public compile(collection: TranslationCollection): string {
		let obj: any = {
			sourceLanguage: 'en',
			resources: {}
		};

		obj.resources[this.xliffFileId] = collection.values
			.reduce((acc, translationInfo) => {
				acc[translationInfo.id] = {
					source: translationInfo.suggestedTranslation,
					target: translationInfo.translation,
					note: translationInfo.note
				};
				return acc;
			}, <any> {});

		return xliff.js2xliff(obj);
	}

	public parse(contents: string): TranslationCollection {
		const obj = xliff.xliff2js(contents);
		let translationUnits = obj.resources[this.xliffFileId];

		let translationInfos = Object.keys(translationUnits)
			.map((translationId) => {
				return {
					id: translationId,
					suggestedTranslation: translationUnits[translationId].source,
					translation: translationUnits[translationId].target,
					note: translationUnits[translationId].note
				};
			});
		return new TranslationCollection(translationInfos);
	}


}

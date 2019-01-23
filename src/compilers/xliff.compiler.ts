import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';
const xliff = require('xliff');

/**
 * XLIFF 1.2 file format compiler
 */
export class XliffCompiler implements CompilerInterface {

	public extension = 'xliff'; // or xlf

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

		return xliff.jsToXliff12(obj);
	}

	public parse(contents: string): TranslationCollection {
		const obj = xliff.xliff12ToJs(contents);
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

import { CompilerInterface } from './compiler.interface';
import { TranslationCollection, TranslationInfo } from '../utils/translation.collection';
import { flattenToTranslation, isFlattenJsonFormat } from '../utils/utils';

export class JsonCompiler implements CompilerInterface {

	public indentation: string = '  ';

	public extension = 'json';

	public constructor(options?: any) {
		if (options && typeof options.indentation !== 'undefined') {
			this.indentation = options.indentation;
		}
	}

	public compile(collection: TranslationCollection): string {
		let translations = collection.values.reduce((acc, currentValue) => {
			acc[currentValue.id] = currentValue;
			return acc;
		}, <any> {});
		return JSON.stringify(translations, null, this.indentation);
	}

	public parse(contents: string): TranslationCollection {
		let translations: { [id: string]: TranslationInfo } = JSON.parse(contents);
		if (!isFlattenJsonFormat(translations)) {
			translations = flattenToTranslation(translations);
		}
		Object.keys(translations).forEach((id) => {
			translations[id].id = id; // fix the ids
		});
		return new TranslationCollection(Object.values(translations));
	}


}

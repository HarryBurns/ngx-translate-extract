import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';
import { flattenToTranslation, unflattenToTranslation } from '../utils/utils';

export class NamespacedJsonCompiler implements CompilerInterface {

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
		translations = unflattenToTranslation(translations);
		return JSON.stringify(translations, null, this.indentation);
	}

	public parse(contents: string): TranslationCollection {
		const translations: {} = flattenToTranslation(JSON.parse(contents));
		return new TranslationCollection(Object.values(translations));
	}

}

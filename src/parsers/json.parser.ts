import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';
import { flattenToTranslation, isFlattenJsonFormat } from '..';

export class JsonParser extends AbstractAstParser implements ParserInterface {

	public extract(contents: string, path?: string): TranslationCollection {
		if (path && this._isJson(path)) {
			try {
				return this._parseJson(JSON.parse(contents));
			} catch (e) {
				console.log('WARNING: unable to parse json file: ${path}', e);
			}
		}
		return new TranslationCollection();
	}

	protected _parseJson(obj: any): TranslationCollection {
		if (!isFlattenJsonFormat(obj)) {
			obj = flattenToTranslation(obj);
		}
		return new TranslationCollection(Object.values(obj));
	}

	protected _isJson(path: string): boolean {
		return (/\.json$/i).test(path);
	}

}

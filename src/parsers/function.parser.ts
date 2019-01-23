import { ParserInterface } from './parser.interface';
import { AbstractAstParser } from './abstract-ast.parser';
import { TranslationCollection } from '../utils/translation.collection';

import * as ts from 'typescript';

export class FunctionParser extends AbstractAstParser implements ParserInterface {

	protected _functionIdentifier: string = '$i18n';

	public constructor(options?: any) {
		super();
		if (options && typeof options.identifier !== 'undefined') {
			this._functionIdentifier = options.identifier;
		}
	}

	public extract(contents: string, path?: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		this._sourceFile = this._createSourceFile(path, contents);

		const callNodes = this._findCallNodes();
		callNodes.forEach(callNode => {
			const args: string[] = this._getCallArgStrings(callNode);
			if (args && args.length) {
				collection.add(args[0], args[1], args[3]);
			}
		});

		return collection;
	}

	/**
	 * Find all calls to marker function
	 */
	protected _findCallNodes(node?: ts.Node): ts.CallExpression[] {
		if (!node) {
			node = this._sourceFile;
		}

		let callNodes = this._findNodes(node, ts.SyntaxKind.CallExpression) as ts.CallExpression[];
		callNodes = callNodes
			.filter(callNode => {
				// Only call expressions with arguments
				if (callNode.arguments.length < 1) {
					return false;
				}

				const identifier = (callNode.getChildAt(0) as ts.Identifier).text;
				if (identifier !== this._functionIdentifier) {
					return false;
				}

				return true;
			});

		return callNodes;
	}

}

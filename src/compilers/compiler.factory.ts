import { CompilerInterface } from './compiler.interface';
import { JsonCompiler } from './json.compiler';
import { PoCompiler } from './po.compiler';
import { NamespacedJsonCompiler } from './namespaced-json.compiler';
import { XliffCompiler } from './xliff.compiler';
import { Xliff2Compiler } from './xliff2.compiler';

export class CompilerFactory {

	public static create(format: string, options?: {}): CompilerInterface {
		switch (format) {
			case 'pot': return new PoCompiler(options);
			case 'xliff': return new XliffCompiler(options);
			case 'xliff2': return new Xliff2Compiler(options);
			case 'json': return new JsonCompiler(options);
			case 'namespaced-json': return new NamespacedJsonCompiler(options);
			default: throw new Error(`Unknown format: ${format}`);
		}
	}

}

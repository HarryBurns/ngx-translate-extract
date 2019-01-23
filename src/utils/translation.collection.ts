export interface TranslationInfo {
	id: string;
	suggestedTranslation?: string;
	note?: string;
	translation?: string; // field to integrate with existing translations in replaced files
}

export class TranslationCollection {

	public values: TranslationInfo[] = [];

	public constructor(translationInfoCollection?: TranslationInfo[]) {
		if (translationInfoCollection) {
			translationInfoCollection.forEach(translationInfo => {
				this.values.push(Object.assign({}, translationInfo));
			});
		}
	}

	/**
	 * Add entry to the current translation collection
	 * @param {string} id translation id
	 * @param {string} [suggestedTranslation] suggested (by developers) translation
	 * @param {string} [note] note for translators
	 */
	public add(id: string, suggestedTranslation?: string, note?: string) {
		this.values.push({
			id: id,
			suggestedTranslation: suggestedTranslation,
			note: note
		});
	}

	/**
	 * Add entry to the current translation collection
	 * @param {TranslationInfo} translationInfo
	 */
	public addTranslationInfo(translationInfo: TranslationInfo) {
		this.values.push(Object.assign({}, translationInfo));
	}

	/**
	 * Remove translation from collection by translation key
	 * @param {string} key
	 */
	public remove(key: string) {
		this.values = this.values.filter(e => e.id === key);
	}

	public forEach(callback: (translationInfo: TranslationInfo) => void): TranslationCollection {
		this.values.forEach(translationInfo => callback.call(this, translationInfo));
		return this;
	}

	/**
	 * Immutable filter function
	 * @param callback predicate
	 */
	public filter(callback: (translationInfo: TranslationInfo) => boolean): TranslationCollection {
		let values: TranslationInfo[] = [];
		this.values.filter(translationInfo => {
			if (callback.call(this, translationInfo)) {
				values.push(translationInfo);
			}
		});
		return new TranslationCollection(values);
	}

	/**
	 * Merge two Translation collections (immutable). If there are duplicates by `id` field - they will be merged.
	 * Source collection values will update parameter collection values (via Object.assign).
	 * @param {TranslationCollection} collection
	 */
	public merge(collection: TranslationCollection): TranslationCollection {
		let newTranslationCollection: TranslationCollection = new TranslationCollection(collection.values);

		this.values.forEach(translationInfo => {
			let duplicateIndex = newTranslationCollection.values.findIndex(v => v.id === translationInfo.id);
			if (duplicateIndex >= 0) {
				newTranslationCollection.values[duplicateIndex] = Object.assign(newTranslationCollection.values[duplicateIndex], translationInfo);
			}
		});

		return newTranslationCollection;
	}

	/**
	 * Concatenate two translation collections (immutable)
	 * @param {TranslationCollection} collection
	 */
	public concat(collection: TranslationCollection): TranslationCollection {
		return new TranslationCollection(this.values.slice(0).concat(collection.values));
	}

	public intersect(collection: TranslationCollection): TranslationCollection {
		let values: TranslationInfo[] = this.values.filter(translationInfo => {
			return collection.values
				.some(anotherTranslationInfo => anotherTranslationInfo.id === translationInfo.id);
		});

		return new TranslationCollection(values);
	}

	/**
	 * Check if there is translation info with specific id
	 * @param {string} id
	 * @return {boolean}
	 */
	public has(id: string): boolean {
		return this.values.some(translationInfo => translationInfo.id === id);
	}

	/**
	 * Get translation info by ID
	 * @param {string} id
	 * @return {TranslationInfo}
	 */
	public get(id: string): TranslationInfo {
		return this.values.find(translationInfo => translationInfo.id === id);
	}

	/**
	 * Get list of all translation IDs
	 * @return {string[]}
	 */
	public ids(): string[] {
		return this.values.map(translationInfo => translationInfo.id);
	}

	public hasDuplicates(): boolean {
		let obj: { [key: string]: boolean } = {};
		for (let i = 0; i < this.values.length; i++) {
			const translationInfo = this.values[i];
			if (obj[translationInfo.id]) {
				return true;
			}
			obj[translationInfo.id] = true;
		}
		return false;
	}

	public getIdDuplicates(): string[] {
		let duplicates = [];
		let obj: { [key: string]: boolean } = {};
		for (let i = 0; i < this.values.length; i++) {
			const translationInfo = this.values[i];
			if (obj[translationInfo.id]) {
				duplicates.push(translationInfo.id);
			}
			obj[translationInfo.id] = true;
		}
		return duplicates;
	}

	public count(): number {
		return this.values.length;
	}

	public isEmpty(): boolean {
		return this.values.length === 0;
	}

	/**
	 * Sort translation collection (immutable). Will return new collection.
	 * @param {(id1: string, id2: string) => number} compareFn
	 */
	public sort(compareFn?: (id1: string, id2: string) => number): TranslationCollection {
		let values = this.values.slice(0).sort((a, b) => {
			return compareFn(a.id, b.id);
		});
		return new TranslationCollection(values);
	}
}

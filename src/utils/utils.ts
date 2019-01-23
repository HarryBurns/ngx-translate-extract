import { TranslationInfo } from './translation.collection';

export function flattenToTranslation(obj: any, path: string[] = [], flatObj: { [key: string]: TranslationInfo } = {}): any {
	Object.keys(obj)
		.forEach(key => {
			let prop = obj[key];
			let newPath = path.slice(0);
			newPath.push(key);
			if (typeof prop === 'object' && prop.id == null) {
				flattenToTranslation(prop, newPath, flatObj);
			} else {
				let newId = newPath.join('.');
				prop.id = newId; // overwrite ID
				flatObj[newId] = <TranslationInfo> prop;
			}
		});
	return flatObj;
}

export function unflattenToTranslation(flatObj: { [key: string]: TranslationInfo }): any {
	let unflatObj: any = {};
	Object.keys(flatObj)
		.forEach(key => {
			let pathArr = key.split('.');
			pathArr.reduce((obj, pathPart, index) => {
				if (index === pathArr.length - 1) {
					// last item
					obj[pathPart] = flatObj[key];
				}
				if (!obj[pathPart]) {
					obj[pathPart] = {};
				}
				return obj[pathPart];
			}, unflatObj);
		});
	return unflatObj;
}

export function isFlattenJsonFormat(translations: any): boolean {
	return Object.keys(translations).every(translationKey => {
		return typeof translations[translationKey] === 'object' && translations[translationKey].id != null;
	});
}

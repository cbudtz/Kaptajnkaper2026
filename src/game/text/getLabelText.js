/** @type {Record<string, string>|null} */
let labelResources = null;

/** @param {Record<string, string>} resources */
export function bindGameLabelResources(resources) {
  labelResources = resources;
}

/** @param {string} key */
export function getLabelText(key) {
  if (!labelResources || labelResources[key] == null) {
    return '';
  }
  return labelResources[key];
}

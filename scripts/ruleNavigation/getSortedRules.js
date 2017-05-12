const RULES_ORDER = ['color', 'font-family', 'font-weight', 'function', 'number', 'string', 'length', 'time', 'unit', 'value', 'value-list',
'custom-property', 'shorthand-property', 'property', 'keyframe-declaration', 'declaration', 'declaration-block', 'block', 'selector',
'selector-list', 'root', 'rule', 'media-feature', 'custom-media', 'media-query-list', 'at-rule', 'stylelint-disable',
'comment'];


export default () => {
  let tmp = [];
  let i = 0;

  let sortedRules = window.__COLLECTION__.filter(item => {
    if (item.__dataUrl.match(/\/user-guide\/rules\/.+/) !== null) {

      const order = RULES_ORDER.findIndex(name =>
        item.title.indexOf(name) === 0 );
      item.order = order === -1 ? RULES_ORDER.length : order;

      return item;
    }
  });

  sortedRules.shift();

  for (i; i <= RULES_ORDER.length; i++) {
    tmp.push([])
  }

  sortedRules.forEach(item => {
   tmp[item.order].push(item);
  });

  sortedRules = [].concat.apply([], tmp);

  return sortedRules;
}

/**
 * Recursive function to flatten an array of items with an array of children.
 *
 * @param {Array} items An array an optional `children` Array
 * @returns {Array}
 */
const flatten = (items) => {
  let children = [];

  return items
    .map((item) => {
      const i = { ...item };
      if (i.children && i.children.length) {
        children = [...children, ...i.children];
      }
      delete i.children;
      return i;
    })
    .concat(children.length ? flatten(children) : children);
};

export default flatten;

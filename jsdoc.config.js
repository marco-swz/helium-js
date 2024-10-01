'use strict';

module.exports = {
    plugins: [],
    source: {
        include: ["src"],
        includePattern: ".+\\.js(doc|x)?$",
        excludePattern: "(^|\\/|\\\\)_",
    }
};

module.exports.defineTags = function(dictionary) {
    dictionary.defineTag('slot', {
        mustHaveValue: true,
        mustNotHaveDescription: false,
        canHaveType: true,
        canHaveName: true,
        onTagged: function(doclet, tag) {
            if (!doclet.slots) {
              doclet.slots = [];
            }

            doclet.slots.push({
              'name': tag.value.name,
              'type': tag.value.type ? (tag.value.type.names.length === 1 ? tag.value.type.names[0] : tag.value.type.names) : '',
              'description': tag.value.description || '',
            });
        }
    });
};

module.exports.handlers = {
  newDoclet: function(e) {
    const parameters = e.doclet.slots;
    if (parameters) {
      const table = tableBuilder.build('Slots', parameters);

      e.doclet.description = `${e.doclet.description}
                              ${table}`;
    }
  }
}

const data = require('./d3dendogram-data.json');

const collapse = (resultArray, parent, child) => {
  if (parent) resultArray.push(`${parent.name} --> ${child.name};`);
  if (child.children.length < 0) return;
  child.children.forEach(collapse.bind(null, resultArray, child));
};

let results = ['graph TD'];

collapse(results, null, data);

console.log(results.sort().join('\n'));
// pipe output to, e.g.,  https://mermaid-js.github.io/mermaid-live-editor/ (as flow diagram)
// or (with modification '-->' to '->' ) to https://dagrejs.github.io/project/dagre-d3/latest/demo/interactive-demo.html

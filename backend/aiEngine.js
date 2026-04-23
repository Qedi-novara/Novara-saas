function analyzeNode(node) {

  let risk = "STABLE";

  if (node.load > 80) risk = "CRITICAL";
  else if (node.load > 60) risk = "WARNING";

  return {
    ...node,
    risk,
    forecast: node.load + Math.floor(Math.random() * 10)
  };
}

module.exports = { analyzeNode };

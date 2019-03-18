const createDomElement = (template) => {
  let newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export default createDomElement;

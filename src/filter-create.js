export default (name, count = 0) => `
<a href="#${name.replace(` `, `-`).toLowerCase()}" class="main-navigation__item">${name}
    ${ count ? `<span class="main-navigation__item-count">${count}</span>` : ``}
</a>
`;

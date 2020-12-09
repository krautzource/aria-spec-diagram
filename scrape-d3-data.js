const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://w3c.github.io/aria/', {
    waitUntil: 'domcontentloaded',
  });
  const tree = await page.evaluate(() => {
    const recurseRoles = (roleSection, parent, setsize) => {
      const roleId = roleSection.id;
      const postfix = roleSection.querySelectorAll('.role-parent li').length > 1 ? ' (*)' : '';
      const roleEntry = {
        name: `${roleId}${postfix}`,
        id: roleId,
        children: [],
        level: 1,
        position: 0,
        setsize: 1,
      };
      if (parent) {
        parent.children.push(roleEntry);
        roleEntry.id = `${parent.id}${roleId}`;
        roleEntry.level = parent.level+1;
        roleEntry.posinset = parent.children.length;
        roleEntry.setsize = setsize;
      }
      roleSection
        .querySelectorAll('.role-children a.role-reference')
        .forEach((link, index, array) => {
          recurseRoles(
            document.querySelector(link.getAttribute('href')),
            roleEntry,
            array.length
          );
        });
      return roleEntry;
    };
    const roleType = document.querySelector('#roletype');
    const result = recurseRoles(roleType);
    return result;
  });
  console.log(JSON.stringify(tree));
  await browser.close();
})();

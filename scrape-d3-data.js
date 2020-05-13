const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://w3c.github.io/aria/', {
    waitUntil: 'domcontentloaded',
  });
  const tree = await page.evaluate(() => {
    const recurseRoles = (roleSection, parent) => {
      const roleId = roleSection.id;
      const roleEntry = {
        name: roleId,
        children: [],
      };
      if (parent) {
        parent.children.push(roleEntry);
      }
      roleSection
        .querySelectorAll('.role-children a.role-reference')
        .forEach((link) => {
          recurseRoles(
            document.querySelector(link.getAttribute('href')),
            roleEntry
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

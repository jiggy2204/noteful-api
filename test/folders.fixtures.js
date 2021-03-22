function makeFoldersArray() {
  return [
    {
      id: 1,
      name: "Cherry",
    },
    {
      id: 2,
      name: "Soda",
    },
    {
      id: 3,
      name: "Pop",
    },
  ];
}

function makeMaliciousFolder() {
  const maliciousFolder = {
    id: 30,
    name: 'Naughty naughty very naughty <script>alert("xss");</script>',
  };
  const expectedFolder = {
    ...makeMaliciousFolder,
    name:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return {
    maliciousFolder,
    expectedFolder,
  };
}

module.exports = {
  makeFoldersArray,
  makeMaliciousFolder,
};

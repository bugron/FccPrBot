const sectionValidator = {
  'Associated Jira story link': (content) => {
    console.log('Handler received content', content);
  },
  'What changed?': (content) => {
    console.log('Handler received content', content);
  },
  'Test plan': (content) => {
    console.log('Handler received content', content);
  },
  'Code checklist': (content) => {
    console.log('Handler received content', content);
  },
};

const requiredSections = Object.keys(sectionValidator);

function templateParser(template) {
  // This regex will match all sections but we do not need to
  // iterate over them in direct order because we are splitting
  // the template by a matched section. Now to get each section
  // individually with splitting we should go from bottom to top
  // instead of top to bottom
  let matches = template.match(/#+.*/g).reverse();

  if (!matches) {
    throw Error('No sections are found');
  }

  console.log('matched sections', matches);
  // check if all required sections exist
  const requiredSectionsExist = requiredSections
    .every(section => matches.some(match => match.includes(section)));

  console.log('requiredSectionsExist', requiredSectionsExist);

  if (!requiredSectionsExist) {
    throw Error('Some of the required sections are not present in the PR desctiption');
  }

  matches.forEach(match => {
    console.log('-------------', match, '-------------');
    // get section's content and the rest of text
    const [templateWithoutSection, sectionContent] = template.split(match);
    // replace template with the rest of text
    template = templateWithoutSection;

    const [matchedRequiredSection] = requiredSections
      .filter(section => match.includes(section));

    console.log('matchedRequiredSection', matchedRequiredSection);

    if (matchedRequiredSection) {
      // dome something with the content of matched section here
      sectionValidator[matchedRequiredSection](sectionContent);
    } else {
      console.log('sectionContent', sectionContent);
    }
  })
}

module.exports = templateParser;

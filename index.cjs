const { faker } = require('@faker-js/faker');

module.exports = () => {
  const data = { users: [] };
  // Create 1000 users
  for (let i = 0; i < 250; i++) {
    data.users.push({
      id: i,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      city: faker.location.city(),
      registered_date: faker.date.past(),
      is_private: Math.random() >= 0.5,
    });
  }
  return data;
};

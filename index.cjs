const { faker } = require('@faker-js/faker');

module.exports = () => {
  const data = { users: [], count: [] };

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
  data.count.push(data.users.length);
  return data;
};

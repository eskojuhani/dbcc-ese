const app = require("./server"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);

test("POST /analyze endpoint", async () => {
  const data = {
    text: "hello 2 times"
  };
  await supertest(app)
    .post(`/analyze`)
    .set('Content-type', 'application/json')
    .send(data)
    .expect(200)
    .then(async (response) =>
      expect(response.body).toStrictEqual({
        characterCount: [{
          "e": 2,
          "h": 1,
          "i": 1,
          "l": 2,
          "m": 1,
          "o": 1,
          "s": 1,
          "t": 1,
        }, ],
        textLength: {
          "withSpaces": 13,
          "withoutSpaces": 11,
        },
        wordCount: 3
      }))
});

test("POST /analyze endpoint 2", async () => {
  const data = {
    text: "want to hire me? part time only.."
  };
  await supertest(app)
    .post(`/analyze`)
    .set('Content-type', 'application/json')
    .send(data)
    .expect(200)
    .then(async (response) =>
      expect(response.body).toStrictEqual({
        characterCount: [{
          "a": 2,
          "e": 3,
          "h": 1,
          "i": 2,
          "l": 1,
          "m": 2,
          "n": 2,
          "o": 2,
          "p": 1,
          "r": 2,
          "t": 4,
          "w": 1,
          "y": 1
        }, ],
        textLength: {
          "withSpaces": 33,
          "withoutSpaces": 27,
        },
        wordCount: 7
      }))
});

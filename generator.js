import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import RandExp from "randexp";

export function generateData(schema) {
  const output = {};

  for (const key in schema) {
    const type = schema[key];
    output[key] = generateValue(type);
  }

  return output;
}

function generateValue(type) {


  if (typeof type === "object" && type.type === "regex") {
    const pattern = type.pattern || "";
    try {
      
      return new RandExp(pattern).gen();
    } catch (err) {
      console.error("Invalid regex pattern:", pattern, err);
      return "";
    }
  }


  if (typeof type === "object") {

    
    if (type.type === "object") {
      const result = {};
      const fields = type.fields || {};
      for (const key in fields) {
        result[key] = generateValue(fields[key]);
      }
      return result;
    }


    if (type.type === "array") {
      const count = type.count || 3;
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push(generateValue(type.items));
      }
      return arr;
    }
  }


  switch (type) {
    case "uuid":
      return uuidv4();

    case "string":
      return faker.lorem.word();

    case "integer":
      return faker.number.int({ min: 1, max: 100 });

    case "float":
      return faker.number.float({
        min: 1,
        max: 100,
        precision: 0.01,
      });

    case "boolean":
      return faker.datatype.boolean();

    case "name":
      return faker.person.fullName();

    case "email":
      return faker.internet.email();

    case "phone":
      return faker.phone.number();

    case "date":
      return faker.date.past().toISOString().split("T")[0];

    case "image_url":
      return `https://picsum.photos/200/300?random=${faker.number.int()}`;

    case "file_url":
      return `https://example.com/files/${faker.string.uuid()}.pdf`;

    case "regex":
      return "";

    default:
      return null;
  }
}

import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";

const MONGO_URI: any = process.env.MONGO_URI;

beforeAll(async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "testing2" });
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.log(error);
  }
});

describe(`POST /clients/register`, () => {
  describe(`Success`, () => {
    test(`Success Created 201`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        email: `nau@email.com`,
        phoneNumber: `08123456789`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`email`, `nau@email.com`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 400, No Email Input`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        phoneNumber: `08123456789`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Path `email` is required.");
    });

    test(`Failed 400, No Phone Number Input`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        email: `nau@email.com`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Path `phoneNumber` is required.");
    });

    test(`Failed 400, No Password Input`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        email: `nau@email.com`,
        phoneNumber: `08123456789`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Path `password` is required.");
    });

    test(`Failed 400, Invalid Email Input`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        email: `nau`,
        phoneNumber: `08123456789`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Invalid email address");
    });

    test(`Failed 400, Email already in Use`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        email: `nau@email.com`,
        phoneNumber: `08123456789`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Email already exist!`);
    });

    test(`Failed 400, Phone Number already in Use`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        email: `frank@email.com`,
        phoneNumber: `08123456789`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `PhoneNumber already exist!`);
    });

    test(`Failed 400, Password fewer than 6 characters`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        email: `frank@email.com`,
        phoneNumber: `08123456789`,
        password: `12345`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Password must be at least 6 characters!`);
    });
  });
});

describe(`POST /workers/register`, () => {
  describe(`Success`, () => {
    test(`Success Created 201`, async () => {
      const response = await request(app).post(`/workers/register`).send({
        email: `farhan@email.com`,
        phoneNumber: `08234567890`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`email`, `farhan@email.com`);
    });
  });

  describe(`Failed`, () => {
    test(`Failed 400, No Email Input`, async () => {
      const response = await request(app).post(`/workers/register`).send({
        phoneNumber: `08234567890`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Path `email` is required.");
    });

    test(`Failed 400, No Phone Number Input`, async () => {
      const response = await request(app).post(`/workers/register`).send({
        email: `farhan@email.com`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Path `phoneNumber` is required.");
    });

    test(`Failed 400, No Password Input`, async () => {
      const response = await request(app).post(`/workers/register`).send({
        email: `farhan@email.com`,
        phoneNumber: `08234567890`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Path `password` is required.");
    });

    test(`Failed 400, Invalid Email Input`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        email: `farhan`,
        phoneNumber: `08234567890`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Invalid email address");
    });

    test(`Failed 400, Email already in Use`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        email: `farhan@email.com`,
        phoneNumber: `08234567890`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Email already exist!`);
    });

    test(`Failed 400, Phone Number already in Use`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        email: `adit@email.com`,
        phoneNumber: `08234567890`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `PhoneNumber already exist!`);
    });

    test(`Failed 400, Password fewer than 6 characters`, async () => {
      const response = await request(app).post(`/clients/register`).send({
        email: `adit@email.com`,
        phoneNumber: `083456789012`,
        password: `12345`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, `Password must be at least 6 characters!`);
    });
  });
});

describe(`POST /login`, () => {
  describe(`Success`, () => {
    test(`Success OK and Create Access Token 200`, async () => {
      const response = await request(app).post(`/login`).send({
        email: `nau@email.com`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`access_token`, expect.any(String));
    });
  });

  describe(`Failed`, () => {
    test(`Failed 400, No Email Input`, async () => {
      const response = await request(app).post(`/login`).send({
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Please input your email!");
    });

    test(`Failed 400, No Password Input`, async () => {
      const response = await request(app).post(`/login`).send({
        email: `nau@email.com`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Please input your password!");
    });

    test(`Failed 400, Invalid Email Input`, async () => {
      const response = await request(app).post(`/login`).send({
        email: `cat@email.com`,
        password: `cheetah123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Invalid email/password");
    });

    test(`Failed 400, Invalid Password Input`, async () => {
      const response = await request(app).post(`/login`).send({
        email: `nau@email.com`,
        password: `tiger123`,
      });

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(`message`, "Invalid email/password");
    });
  });
});

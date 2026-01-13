import { vi } from 'vitest';

export const mockLocalStorage = (() => {
  let store = {};

  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

export const waitForElementToBeRemoved = async (callback) => {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(() => {
    expect(callback()).not.toBeInTheDocument();
  });
};


export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockFetch = (data, ok = true) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
    })
  );
};

export const suppressConsoleError = () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
};

export const createMockFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  return formData;
};
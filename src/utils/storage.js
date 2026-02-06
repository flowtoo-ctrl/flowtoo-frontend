// Storage helper: use localStorage if possible, fallback to cookies
const isLocalStorageAvailable = () => {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

// Save item
export const setItem = (key, value, days = 7) => {
  if (isLocalStorageAvailable()) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn("LocalStorage blocked, falling back to cookies:", err);
      document.cookie = `${key}=${encodeURIComponent(
        JSON.stringify(value)
      )};max-age=${days * 24 * 60 * 60};path=/`;
    }
  } else {
    // fallback to cookie
    document.cookie = `${key}=${encodeURIComponent(
      JSON.stringify(value)
    )};max-age=${days * 24 * 60 * 60};path=/`;
  }
};

// Get item
export const getItem = (key) => {
  if (isLocalStorageAvailable()) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch {
      // fallback to cookie
      const match = document.cookie.match(
        new RegExp("(^| )" + key + "=([^;]+)")
      );
      return match ? JSON.parse(decodeURIComponent(match[2])) : null;
    }
  } else {
    const match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
    return match ? JSON.parse(decodeURIComponent(match[2])) : null;
  }
};

// Remove item
export const removeItem = (key) => {
  if (isLocalStorageAvailable()) {
    try {
      localStorage.removeItem(key);
    } catch {
      document.cookie = `${key}=;max-age=0;path=/`;
    }
  } else {
    document.cookie = `${key}=;max-age=0;path=/`;
  }
};


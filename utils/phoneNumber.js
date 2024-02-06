import parsePhoneNumber from "libphonenumber-js";

const validatePhone = (ph) => {
  try {
    const parsed = parsePhoneNumber(ph, "+91"); // 'ZZ' is a placeholder for an unknown region
    if (parsed && parsed.isValid()) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export { validatePhone };

function orderValidator(data) {
  const error = {};
  const shippingAddressError = {};

  if (!data.products) {
    error.products = "Products field is required!";
  } else if (data.products.length === 0) {
    error.products = "You have to provide minimum 1 product!";
  }
  if (!data.shippingAddress || Object.keys(data.shippingAddress).length === 0) {
    error.shippingAddress = "The shipping address field is required!";
  }
  if (!data.shippingAddress.addressType) {
    shippingAddressError.addressType = "The address type field is required!";
  } else if (
    data.shippingAddress.addressType !== "Office" &&
    data.shippingAddress.addressType !== "Home" &&
    data.shippingAddress.addressType !== "Other"
  ) {
    shippingAddressError.addressType = "Please provide valid address type!";
  }
  if (!data.shippingAddress.country) {
    shippingAddressError.country = "The country field is required!";
  }
  if (!data.shippingAddress.state) {
    shippingAddressError.state = "The state field is required!";
  }
  if (!data.shippingAddress.city) {
    shippingAddressError.city = "The city field is required!";
  }
  if (!data.shippingAddress.policeStation) {
    shippingAddressError.policeStation =
      "The police station field is required!";
  }
  if (!data.shippingAddress.zipcode) {
    shippingAddressError.zipcode = "The zipcode field is required!";
  } else if (isNaN(data.shippingAddress.zipcode)) {
    shippingAddressError.zipcode = "Please provide a numeric value!";
  } else if (data.shippingAddress.zipcode.toString().length !== 4) {
    shippingAddressError.zipcode = "Please provide a valid zipcode!";
  }
  if (!data.shippingAddress.house) {
    shippingAddressError.house = "The house field is required!";
  }

  if (Object.keys(shippingAddressError).length > 0) {
    error.shippingAddress = shippingAddressError;
  }

  return {
    isValid: Object.keys(error).length === 0,
    error,
  };
}

module.exports = orderValidator;

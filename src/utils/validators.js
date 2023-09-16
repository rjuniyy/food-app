// // import { View, Text } from "react-native";
// import React from "react";

// const validators = () => {
//   const [formData, setData] = React.useState({});
//   const [errors, setErrors] = React.useState({});

//   if (formData.name === undefined) {
//     setErrors({ ...errors, name: "Name is required" });
//     return false;
//   } else if (formData.name.length < 3) {
//     setErrors({ ...errors, name: "Name is too short" });
//     return false;
//   }

//   //   return (
//   //     <View>
//   //       <Text>validators</Text>
//   //     </View>
//   //   );
//   return true;
// };

// export default validators;

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

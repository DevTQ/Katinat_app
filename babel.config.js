module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "module-resolver",
    ["@babel/plugin-transform-class-properties", { loose: true }],
    ["@babel/plugin-transform-private-methods", { loose: true }],
    ["@babel/plugin-transform-private-property-in-object", { loose: true }]
  ],
};


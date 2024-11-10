module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: ['nativewind/babel'], // NativeWind plugin for Tailwind CSS in React Native
    };
};

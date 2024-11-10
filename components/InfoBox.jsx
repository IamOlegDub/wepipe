import { View, Text } from 'react-native';
import React from 'react';

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
    return (
        <View className={containerStyles}>
            <Text
                className={`text-secondary-200 text-center font-psemibold ${titleStyles}`}
            >
                {title}
            </Text>
            <Text
                className={`text-gray-100 text-center font-pregular text-sm ${titleStyles}`}
            >
                {subtitle}
            </Text>
        </View>
    );
};

export default InfoBox;

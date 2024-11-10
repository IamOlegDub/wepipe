import { View, Text, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import Entypo from '@expo/vector-icons/Entypo';

const FormField = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-gray-100 font-pmedium">
                {title}
            </Text>
            <View className="border border-secondary-100 w-full h-16 px-4 bg-primary rounded-2xl focus:border-secondary-200 items-center flex-row">
                <TextInput
                    className="flex-1 text-secondary-200 font-psemibold text-base"
                    value={value}
                    onChangeText={handleChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#7b7b8b"
                    secureTextEntry={title === 'Password' && !showPassword}
                    selectionColor="#3c6382"
                />
                {title === 'Password' && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Entypo
                            name={!showPassword ? 'eye' : 'eye-with-line'}
                            size={24}
                            color="#CDCDE0"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default FormField;

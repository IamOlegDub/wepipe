import { View, Text, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { icons } from '../constants';
import { router, usePathname } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

const SearchInput = ({ initialQuery }) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || '');
    return (
        <View className="border border-secondary-100 w-full h-16 px-4 bg-primary rounded-2xl focus:border-secondary-200 items-center flex-row space-x-4">
            <TextInput
                className="text-secondary-200 flex-1 font-pregular mt-0.5 text-base"
                value={query}
                onChangeText={(e) => setQuery(e)}
                placeholder={'Search for a video topic'}
                placeholderTextColor="#7b7b8b"
                selectionColor="#3c6382"
            />
            <TouchableOpacity
                onPress={() => {
                    if (!query) {
                        return Alert.alert(
                            'Missing query',
                            'Please input something to search results across database'
                        );
                    }
                    if (pathname.startsWith('/search'))
                        router.setParams({ query });
                    else router.push(`/search/${query}`);
                }}
            >
                <AntDesign name="search1" size={24} color="#3c6382" />
            </TouchableOpacity>
        </View>
    );
};

export default SearchInput;

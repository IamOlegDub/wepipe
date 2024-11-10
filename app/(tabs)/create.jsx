import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import { TouchableOpacity } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { icons } from '../../constants';
import CustomButton from '../../components/CustomButton';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { createVideo } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import Entypo from '@expo/vector-icons/Entypo';

const Create = () => {
    const { user } = useGlobalContext();
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        video: null,
        thumbnail: null,
    });

    const openPicker = async (selectType) => {
        const result = await DocumentPicker.getDocumentAsync({
            type:
                selectType === 'image'
                    ? ['image/png', 'image/jpg', 'image/jpeg']
                    : ['video/mp4', 'video/gif'],
        });
        if (!result.canceled) {
            if (selectType === 'image') {
                setForm({ ...form, thumbnail: result.assets[0] });
            }
            if (selectType === 'video') {
                setForm({ ...form, video: result.assets[0] });
            }
        }
    };

    const submit = async () => {
        if (!form.thumbnail || !form.title || !form.video) {
            return Alert.alert('Please fill in all the fields');
        }

        setUploading(true);

        try {
            await createVideo({ ...form, userId: user.$id });
            Alert.alert('Success', 'Post uploaded successfully');
            router.push('/home');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setForm({
                title: '',
                video: null,
                thumbnail: null,
            });
            setUploading(false);
        }
    };
    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView className="px-4 my-6">
                <Text className="text-2xl text-secondary-400 font-psemibold">
                    Upload video
                </Text>
                <FormField
                    title="Video Title"
                    value={form.title}
                    placeholder="Give your video a catch title"
                    handleChangeText={(e) => setForm({ ...form, title: e })}
                    otherStyles="mt-10"
                />
                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Uplaod video
                    </Text>
                    <TouchableOpacity onPress={() => openPicker('video')}>
                        {form.video ? (
                            <Video
                                source={{ uri: form.video.uri }}
                                className="w-full h-64 rounded-2xl"
                                resizeMode={ResizeMode.COVER}
                            />
                        ) : (
                            <View className="w-full h-40 px-4 bg-primary border border-secondary-100 rounded-2xl justify-center items-center">
                                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                                    <Entypo
                                        name="upload"
                                        size={48}
                                        color="#ed6a5a"
                                    />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Thumbnail Image
                    </Text>
                    <TouchableOpacity onPress={() => openPicker('image')}>
                        {form.thumbnail ? (
                            <Image
                                source={{ uri: form.thumbnail.uri }}
                                className="w-full h-64 rounded-2xl"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="w-full h-16 px-4 bg-primary rounded-2xl justify-center items-center border border-secondary-100 flex-row space-x-2">
                                <Entypo
                                    name="upload"
                                    size={20}
                                    color="#ed6a5a"
                                />
                                <Text className="text-sm text-gray-100 font-pmedium">
                                    Choose a file
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <CustomButton
                    title="Submit & Publish"
                    handlePress={submit}
                    containerStyles="mt-7"
                    isLoading={uploading}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Create;

import React, { useState } from 'react';
import { View, Text, Image, Alert, TouchableOpacity } from 'react-native';
import { Menu } from 'react-native-paper';
import { ResizeMode, Video } from 'expo-av';
import { deleteVideo } from '../lib/appwrite';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

const VideoCard = ({
    video: {
        title,
        thumbnail,
        video,
        creator: { avatar, username },
    },
    id,
    isVideoLiked,
    onToggleLike,
    isProfile,
    refetch,
}) => {
    const [play, setPlay] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const onRemoveVideo = () => {
        Alert.alert(
            'Remove Video',
            'Are you sure you want to remove this video?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    onPress: async () => {
                        try {
                            await deleteVideo(id);
                            await refetch();
                        } catch (error) {
                            console.error('Error removing video:', error);
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <View className="flex-col items-center px-4 mb-14">
            <View className="flex-row gap-3 items-start">
                <View className="justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-full border-2 border-secondary-200 justify-center items-center p-0.5">
                        <Image
                            source={{ uri: avatar }}
                            className="w-full h-full rounded-full"
                            resizeMode="cover"
                        />
                    </View>
                    <View className="justify-center flex-1 ml-3 gap-y-1">
                        <Text
                            className="text-secondary-200 font-psemibold text-sm"
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                        <Text
                            className="text-xs text-gray-100 font-pregular"
                            numberOfLines={1}
                        >
                            {username}
                        </Text>
                    </View>

                    <View className=" flex flex-row">
                        <TouchableOpacity
                            onPress={onToggleLike}
                            className="p-2"
                        >
                            <AntDesign
                                name={isVideoLiked ? 'heart' : 'hearto'}
                                size={20}
                                color="#ed6a5a"
                            />
                        </TouchableOpacity>

                        {isProfile && (
                            <Menu
                                visible={menuVisible}
                                anchorPosition="bottom"
                                onDismiss={closeMenu}
                                anchor={
                                    <TouchableOpacity
                                        onPress={openMenu}
                                        className="p-2"
                                    >
                                        <Entypo
                                            name="dots-three-vertical"
                                            size={20}
                                            color="#3c6382"
                                        />
                                    </TouchableOpacity>
                                }
                            >
                                <Menu.Item
                                    onPress={() => {
                                        closeMenu();
                                        onRemoveVideo();
                                    }}
                                    title="Remove Video"
                                />
                            </Menu>
                        )}
                    </View>
                </View>
            </View>

            {play ? (
                <Video
                    source={{ uri: video }}
                    className="w-full h-60 rounded-xl mt-3"
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                        if (status.didJustFinish) {
                            setPlay(false);
                        }
                    }}
                />
            ) : (
                <TouchableOpacity
                    className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}
                >
                    <Image
                        source={{ uri: thumbnail }}
                        className="w-full h-full rounded-xl mt-3"
                        resizeMode="cover"
                    />
                    <AntDesign
                        name="play"
                        size={48}
                        color="white"
                        style={{
                            position: 'absolute',
                        }}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default VideoCard;

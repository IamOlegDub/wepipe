import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import useAppwrite from '../../lib/useAppwrite';
import { getLikedVideosByUserId } from '../../lib/appwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';

const Bookmark = () => {
    const { user, likedVideos, toggleLike, loadLikedVideos } =
        useGlobalContext();
    const [refreshing, setRefreshing] = useState(false);
    const { data: allSavedPosts, refetch } = useAppwrite(() =>
        getLikedVideosByUserId(user.$id)
    );

    useEffect(() => {
        refetch();
    }, [likedVideos]);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const isVideoLiked = (videoId) => likedVideos.includes(videoId);

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={
                    allSavedPosts?.filter((post) =>
                        likedVideos.includes(post.$id)
                    ) || []
                }
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard
                        video={item}
                        id={user.$id}
                        isVideoLiked={isVideoLiked(item.$id)}
                        onToggleLike={() => toggleLike(item.$id)}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="flex my-6 px-4 space-y-6">
                        <View className="flex justify-between items-start flex-row mb-6">
                            <View>
                                <Text className="text-2xl text-secondary-400 font-psemibold">
                                    Saved Videos
                                </Text>
                            </View>
                        </View>
                        <SearchInput />
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState title="No saved videos" isBackToHome />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaView>
    );
};

export default Bookmark;

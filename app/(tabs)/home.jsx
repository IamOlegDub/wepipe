import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { getAllPosts, getLatestPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';

const Home = () => {
    const { user, likedVideos, toggleLike, loadLikedVideos } =
        useGlobalContext();
    const { data: posts, refetch } = useAppwrite(getAllPosts);
    const { data: latestPosts } = useAppwrite(getLatestPosts);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        loadLikedVideos(user.$id);
        setRefreshing(false);
    };

    useEffect(() => {
        if (user) {
            loadLikedVideos(user.$id);
        }
    }, [user]);

    const isVideoLiked = (videoId) => likedVideos.includes(videoId);

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard
                        video={item}
                        id={item.$id}
                        isVideoLiked={isVideoLiked(item.$id)}
                        onToggleLike={() => toggleLike(item.$id)}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="flex my-6 px-4 space-y-6">
                        <View className="flex justify-between items-start flex-row mb-6">
                            <View>
                                <Text className="font-pmedium text-sm text-secondary-400">
                                    Welcome Back,
                                </Text>
                                <Text className="text-2xl font-psemibold text-secondary-200">
                                    {user?.username}
                                </Text>
                            </View>
                            <View className="mt-1.5">
                                <Image
                                    source={images.logoSmall}
                                    resizeMode="contain"
                                    className="w-9 h-10"
                                />
                            </View>
                        </View>
                        <SearchInput />
                        <View className="w-full flex-1 pt-5 pb-8">
                            <Text className="text-secondary-200 text-lg font-pregular">
                                Latest videos
                            </Text>
                            <Trending posts={latestPosts ?? []} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No videos Found"
                        subtitle="Be the first one to upload a video"
                    />
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

export default Home;

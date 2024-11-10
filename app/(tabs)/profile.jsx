import {
    View,
    FlatList,
    Image,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import { getUsersPosts, signOut } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import AntDesign from '@expo/vector-icons/AntDesign';
import InfoBox from '../../components/InfoBox';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

const Profile = () => {
    const {
        user,
        setUser,
        setIsLoggedIn,
        likedVideos,
        toggleLike,
        loadLikedVideos,
    } = useGlobalContext();

    const { data: posts, refetch } = useAppwrite(() => getUsersPosts(user.$id));

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const logout = async () => {
        await signOut();
        setUser(null);
        loadLikedVideos(user.$id);
        setIsLoggedIn(false);
        router.replace('/sign-in');
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
                        isProfile
                        refetch={refetch}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                        <TouchableOpacity
                            className="w-full items-end mb-10"
                            onPress={logout}
                        >
                            <AntDesign
                                name="logout"
                                size={24}
                                color="#ED6A5A"
                            />
                        </TouchableOpacity>
                        <View className="w-20 h-20 border-2 border-secondary-200 justify-center items-center rounded-full">
                            <Image
                                source={{ uri: user?.avatar }}
                                className="w-[90%] h-[90%] rounded-full"
                                resizeMode="cover"
                            />
                        </View>
                        <InfoBox
                            title={user?.username}
                            containerStyles="mt-5"
                            titleStyles="text-lg"
                        />
                        <View className="mt-5 flex-row">
                            <InfoBox
                                title={posts.length || 0}
                                subtitle="Posts"
                                containerStyles="mr-10"
                                titleStyles="text-xl"
                            />
                            <InfoBox
                                title="1.2k"
                                subtitle="Followers"
                                titleStyles="text-xl"
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No videos Found"
                        subtitle="No videos found for this search query"
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

export default Profile;

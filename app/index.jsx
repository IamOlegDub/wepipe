import { Link, Redirect, router } from 'expo-router';
import { Image, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import { images } from '../constants';
import { useGlobalContext } from '@/context/GlobalProvider';

export default function App() {
    const { isLoading, isLoggedIn } = useGlobalContext();

    if (!isLoading && isLoggedIn) return <Redirect href="/home" />;
    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className="w-full justify-center items-center min-h-[85vh] px-4">
                    <Image
                        source={images.logo}
                        className="w-[250px] h-[100px] mt-8"
                        resizeMode="contain"
                    />
                    <View className="w-full h-[400px] justify-center items-center rounded-full overflow-hidden shadow-2xl">
                        <Image
                            source={images.starting}
                            className="max-w-[1024px] w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                    <View className="relative mt-5 items-center justify-center">
                        <Text className="text-3xl text-black font-bold text-center">
                            Discover Endless
                        </Text>
                        <View className="flex-row items-center justify-center">
                            <Text className="text-3xl text-black font-bold text-center">
                                Possibilities with{' '}
                            </Text>
                            <Image
                                source={images.logoText}
                                alt="logo text"
                                resizeMode="contain"
                                className="w-[110px] h-[36px]"
                            />
                        </View>
                    </View>
                    <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
                        Where Creativity Meets Innovation: Embark on a Journey
                        of Limitless Exploration with WePipe
                    </Text>
                    <CustomButton
                        title="Continue with Email"
                        handlePress={() => router.push('/sign-in')}
                        containerStyles="w-full mt-7"
                    />
                </View>
            </ScrollView>
            <StatusBar
                backgroundColor="#ffffff"
                style="light"
                barStyle="dark-content"
            />
        </SafeAreaView>
    );
}

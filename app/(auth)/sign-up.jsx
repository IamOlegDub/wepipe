import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants/';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const SignUp = () => {
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if (form.username === '' || form.email === '' || form.password === '') {
            Alert.alert('Error', 'Please fill in all fields');
        }
        setIsSubmitting(true);
        try {
            const result = await createUser(
                form.email,
                form.password,
                form.username
            );
            setUser(result);
            setIsLoggedIn(true);
            router.replace('/home');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView>
                <View className="w-full justify-center min-h-[86vh] px-4 my-6">
                    <Image
                        className="w-[220px] h-auto self-start"
                        resizeMode="contain"
                        source={images.logo}
                    />
                    <Text className="text-semibold text-2xl text-secondary-400 mt-10 font-psemibold">
                        Sign up to WePipe
                    </Text>
                    <FormField
                        title="Username"
                        value={form.username}
                        handleChangeText={(e) =>
                            setForm({ ...form, username: e })
                        }
                        otherStyles="mt-10"
                    />
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) =>
                            setForm({ ...form, password: e })
                        }
                        otherStyles="mt-7"
                    />
                    <CustomButton
                        title="Sign Up"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />
                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Have an account already?
                        </Text>
                        <Link
                            className="text-lg text-secondary font-psemibold"
                            href="/sign-in"
                        >
                            Sign In
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;
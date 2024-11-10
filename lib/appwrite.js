import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
} from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora_oleg',
    projectId: '6705048c0031cc06ef06',
    databaseId: '670505ed002fde762912',
    userCollectionId: '67050612000bdb40be03',
    videoCollectionId: '672354730008767822ce',
    storageId: '67050d3500291549e18b',
};

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = appwriteConfig;

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        );
        return session;
    } catch (error) {
        throw new Error(error);
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
};

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const getLikedVideosByUserId = async (userId) => {
    try {
        const userResponse = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('$id', userId)]
        );

        if (!userResponse.documents.length) {
            throw new Error(`User with ID ${userId} not found.`);
        }

        const userDocument = userResponse.documents[0];

        const likedVideos = userDocument.liked_videos || [];

        if (likedVideos.length === 0) {
            return [];
        }

        return likedVideos;
    } catch (error) {
        console.error('Error fetching liked videos:', error);
        throw new Error('Failed to retrieve liked videos.');
    }
};

export const toggleLikeVideo = async (userId, videoId) => {
    try {
        const userResponse = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('$id', userId)]
        );

        if (!userResponse.documents.length) {
            throw new Error(`User with ID ${userId} not found.`);
        }

        const userDocument = userResponse.documents[0];
        let likedVideos = userDocument.liked_videos || [];

        const isLiked = likedVideos.some((video) => video.$id === videoId);
        console.log(isLiked);

        if (isLiked) {
            likedVideos = likedVideos.filter((video) => video.$id !== videoId);
        } else {
            likedVideos.push(videoId);
        }

        const updateData = {
            liked_videos: likedVideos.length ? likedVideos : [],
        };

        await databases.updateDocument(
            databaseId,
            userCollectionId,
            userDocument.$id,
            updateData
        );

        return { success: true, isLiked: !isLiked };
    } catch (error) {
        console.error('Error toggling like status:', error);
        throw new Error('Failed to toggle like status.');
    }
};

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const getUsersPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error);
    }
};

export const getFilePreview = async (fileId, type) => {
    let fileUrl;
    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(
                storageId,
                fileId,
                2000,
                2000,
                'top',
                100
            );
        } else {
            throw new Error('Invalid file type');
        }
        if (!fileUrl) throw Error;
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
};

export const uploadFile = async (file, type) => {
    if (!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
        const uploadFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );
        const fileUrl = await getFilePreview(uploadFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
};

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ]);

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                creator: form.userId,
            }
        );
        return newPost;
    } catch (error) {
        throw new Error(error);
    }
};

export const deleteVideo = async (documentId) => {
    try {
        await databases.deleteDocument(
            databaseId,
            videoCollectionId,
            documentId
        );
        console.log('Video successfully deleted from Appwrite.');
    } catch (error) {
        console.error('Failed to delete video:', error);
    }
};

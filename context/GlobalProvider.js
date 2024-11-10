import { createContext, useContext, useEffect, useState } from 'react';
import {
    getCurrentUser,
    getLikedVideosByUserId,
    toggleLikeVideo,
} from '../lib/appwrite';

const GlobalContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    user: null,
    setUser: () => {},
    isLoading: false,
    likedVideos: [],
    loadLikedVideos: () => {},
    toggleLike: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likedVideos, setLikedVideos] = useState([]);

    // Load the current user and liked videos on initial mount
    useEffect(() => {
        const loadUserAndLikes = async () => {
            try {
                setIsLoading(true);
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    setIsLoggedIn(true);
                    setUser(currentUser);
                    await loadLikedVideos(currentUser.$id); // Load liked videos for the user
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                    setLikedVideos([]); // Clear liked videos if no user
                }
            } catch (error) {
                console.error('Error loading user or liked videos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserAndLikes();
    }, []);

    // Load liked videos for a specific user
    const loadLikedVideos = async (userId) => {
        // Check if userId is valid before proceeding
        if (!userId) return;

        try {
            const likedVideosList = await getLikedVideosByUserId(userId);
            setLikedVideos(likedVideosList.map((video) => video.$id)); // Store only video IDs
        } catch (error) {
            console.error('Error loading liked videos:', error);
        }
    };

    // Toggle like status for a video and update likedVideos in context
    const toggleLike = async (videoId) => {
        try {
            // Optimistically update likedVideos
            setLikedVideos((prevLikedVideos) => {
                if (prevLikedVideos.includes(videoId)) {
                    return prevLikedVideos.filter((id) => id !== videoId);
                } else {
                    return [...prevLikedVideos, videoId];
                }
            });

            // Call backend to toggle like status
            const { isLiked } = await toggleLikeVideo(user.$id, videoId);

            // Ensure likedVideos reflects backend result in case of unexpected issues
            setLikedVideos((prevLikedVideos) => {
                return isLiked
                    ? [...new Set([...prevLikedVideos, videoId])]
                    : prevLikedVideos.filter((id) => id !== videoId);
            });
        } catch (error) {
            console.error('Error toggling like status:', error);
            // Optionally revert the optimistic update in case of an error
            setLikedVideos((prevLikedVideos) => {
                return prevLikedVideos.includes(videoId)
                    ? prevLikedVideos.filter((id) => id !== videoId)
                    : [...prevLikedVideos, videoId];
            });
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                likedVideos,
                loadLikedVideos,
                toggleLike,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;

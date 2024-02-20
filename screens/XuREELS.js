import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import FakeNavBar from './FakeNavBar';

const XuREELS = ({ handleNavigation }) => {
    const [selectedVideos, setSelectedVideos] = useState([]);

    const handleUploadVideo = (video) => {
        setSelectedVideos((prevVideos) => [...prevVideos, video]);
    };

    const handleTogglePlay = (index) => {
        const updatedVideos = [...selectedVideos];
        updatedVideos[index].paused = !updatedVideos[index].paused;
        setSelectedVideos(updatedVideos);
    };

    const handleSelectVideo = async () => {
        try {
            const video = await ImagePicker.openPicker({
                mediaType: 'video',
            });

            // Add a 'paused' property to control play/pause state
            video.paused = false;

            // Pass the selected video to the parent component
            handleUploadVideo(video);
        } catch (error) {
            console.log('Error selecting video:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* XuREELS label on the top left */}
            <View style={styles.xuReelsLabel}>
                <Text style={styles.labelText}>XuREELS</Text>
            </View>

            {/* FastImage on the top right */}
            <FastImage
                source={require('../assets/camg.png')}
                style={styles.cameraIcon}
                resizeMode={FastImage.resizeMode.contain}
            />

            {/* Swiper component */}
            <Swiper
                loop={false}
                index={0}
                showsPagination={false}
                onIndexChanged={(index) => console.log(`Swiped to index ${index}`)}
            >
                {selectedVideos.map((item, index) => (
                    <TouchableOpacity
                        key={item.path}
                        style={styles.videoContainer}
                        onPress={() => handleTogglePlay(index)}
                    >
                        <Video
                            source={{ uri: item.path }}
                            style={styles.video}
                            controls={false}
                            resizeMode="cover"
                            paused={item.paused}
                        />
                    </TouchableOpacity>
                ))}
            </Swiper>

            {/* FakeNavBar at the bottom */}
            <FakeNavBar handleSelectVideo={handleSelectVideo} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111111',
    },
    xuReelsLabel: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    labelText: {
        color: 'white',
        fontSize: 18,
    },
    cameraIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 30,
        height: 30,
        zIndex: 1,
    },
    videoContainer: {
        flex: 1,
    },
    video: {
        flex: 1,
    },
});

export default XuREELS;
